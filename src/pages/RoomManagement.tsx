
import DashboardShell from "@/components/ui/dashboard-shell";
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import RoomSearch from "@/components/rooms/RoomSearch";
import RoomStatusTabs from "@/components/rooms/RoomStatusTabs";
import { Reservation } from "@/types";
import { useState, useEffect } from "react";
import { RoomManagementHeader } from "@/components/admin/rooms/RoomManagementHeader";
import { Loader } from "lucide-react";
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
    showAddReservation,
    setShowAddReservation,
    filterRooms,
    getStatusColor,
    refetchRooms
  } = useRoomManagement();

  const { toast } = useToast();
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Effect to refetch rooms when tab is visited
  useEffect(() => {
    refetchRooms();
  }, [refetchRooms]);

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
  };

  const handleRetry = () => {
    toast({ title: "Retrying", description: "Attempting to reload room data" });
    refetchRooms();
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <RoomManagementHeader />
        
        <RoomSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddReservation={() => setShowAddReservation(true)}
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
              <Button onClick={() => setShowAddReservation(true)}>Add Reservation</Button>
            </CardContent>
          </Card>
        ) : (
          <RoomStatusTabs
            roomsData={roomsData}
            filterRooms={filterRooms}
            getStatusColor={getStatusColor}
            onRoomClick={handleRoomClick}
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

      <AddReservationDialog
        open={showAddReservation}
        onOpenChange={setShowAddReservation}
        onReservationAdded={(res) => setReservations([...reservations, res])}
      />
    </DashboardShell>
  );
};

export default RoomManagement;
