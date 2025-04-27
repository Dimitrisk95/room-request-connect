
import { useAuth } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RoomAddDialog from "./RoomAddDialog";
import RoomsTable from "./RoomsTable";
import { useHotelRooms } from "@/hooks/useHotelRooms";
import { RoomFilterBar } from "./rooms/RoomFilterBar";
import { RoomManagementHeader } from "./rooms/RoomManagementHeader";

const HotelRoomManagement = () => {
  const { user } = useAuth();
  const {
    isLoading,
    rooms,
    showAddDialog,
    setShowAddDialog,
    editingRoom,
    setEditingRoom,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    handleEditRoom,
    handleAddRoomClick,
    fetchRooms,
    roomTypes,
  } = useHotelRooms();

  if (!user?.hotelId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Management</CardTitle>
          <CardDescription>
            Please create a hotel first to start managing rooms
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <RoomManagementHeader />
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <RoomFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            roomTypes={roomTypes}
          />
          
          <Button onClick={handleAddRoomClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
        
        <RoomsTable 
          rooms={rooms} 
          isLoading={isLoading} 
          onEdit={handleEditRoom}
          onRoomDeleted={fetchRooms}
        />
        
        <RoomAddDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onRoomAdded={fetchRooms}
          editingRoom={editingRoom}
          onEditComplete={() => setEditingRoom(null)}
        />
      </CardContent>
    </Card>
  );
};

export default HotelRoomManagement;
