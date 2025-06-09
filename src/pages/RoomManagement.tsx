
import { useState, useEffect } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog";
import { RoomStatusDialog } from "@/components/rooms/RoomStatusDialog";
import { RoomStatusSummary } from "@/components/rooms/RoomStatusSummary";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import RoomSearch from "@/components/rooms/RoomSearch";
import RoomStatusTabs from "@/components/rooms/RoomStatusTabs";
import { Reservation, Room } from "@/types";
import { RoomManagementHeader } from "@/components/admin/rooms/RoomManagementHeader";
import { Loader, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const RoomManagement = () => {
  const {
    searchTerm,
    setSearchTerm,
    roomsData,
    isLoading,
    error,
    selectedRoom,
    setSelectedRoom,
    filterRooms,
    getStatusColor,
    refetchRooms
  } = useRoomManagement();

  const { toast } = useToast();
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusUpdateRoom, setStatusUpdateRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Effect to refetch rooms when tab is visited
  useEffect(() => {
    refetchRooms();
  }, [refetchRooms]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
  };

  const handleStatusUpdate = (room: Room) => {
    setStatusUpdateRoom(room);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdated = (updatedRoom: Room) => {
    // Update the room in the local state
    refetchRooms();
    setRefreshKey(prev => prev + 1);
  };

  const handleRoomsUpdated = (updatedRooms: Room[]) => {
    // Refresh the entire room list when bulk updates occur
    refetchRooms();
    setRefreshKey(prev => prev + 1);
  };

  const handleRetry = () => {
    toast({ title: "Retrying", description: "Attempting to reload room data" });
    refetchRooms();
  };

  const handleRefresh = () => {
    refetchRooms();
    setRefreshKey(prev => prev + 1);
    toast({ title: "Refreshed", description: "Room data has been updated" });
  };

  const handleSummaryRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <RoomManagementHeader />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <RoomStatusSummary onRefresh={handleSummaryRefresh} />
        
        <RoomSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Loading rooms...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-destructive mb-4">Failed to load rooms</p>
              <Button onClick={handleRetry}>Retry</Button>
            </CardContent>
          </Card>
        ) : roomsData.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No rooms found</p>
              <p className="text-sm text-muted-foreground">Use the admin dashboard to add rooms to your hotel.</p>
            </CardContent>
          </Card>
        ) : (
          <RoomStatusTabs
            roomsData={roomsData}
            filterRooms={filterRooms}
            getStatusColor={getStatusColor}
            onRoomClick={handleRoomClick}
            onStatusUpdate={handleStatusUpdate}
            onRoomsUpdated={handleRoomsUpdated}
          />
        )}
      </div>

      <RoomDetailsDialog
        open={roomDetailsOpen}
        onOpenChange={setRoomDetailsOpen}
        room={selectedRoom}
        reservations={reservations}
        onReservationAdded={(res) => setReservations([...reservations, res])}
        onReservationUpdated={(res) => {
          setReservations(prev => prev.map(r => r.id === res.id ? res : r));
        }}
        onReservationDeleted={(id) => {
          setReservations(prev => prev.filter(r => r.id !== id));
        }}
      />

      <RoomStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        room={statusUpdateRoom}
        onStatusUpdated={handleStatusUpdated}
      />
    </DashboardShell>
  );
};

export default RoomManagement;
