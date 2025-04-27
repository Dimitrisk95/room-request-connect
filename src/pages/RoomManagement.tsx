
import DashboardShell from "@/components/ui/dashboard-shell";
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import RoomSearch from "@/components/rooms/RoomSearch";
import RoomStatusTabs from "@/components/rooms/RoomStatusTabs";
import { Reservation } from "@/types";
import { useState, useEffect } from "react";
import { RoomManagementHeader } from "@/components/admin/rooms/RoomManagementHeader";

const RoomManagement = () => {
  const {
    searchTerm,
    setSearchTerm,
    roomsData,
    selectedRoom,
    setSelectedRoom,
    showAddReservation,
    setShowAddReservation,
    filterRooms,
    getStatusColor,
  } = useRoomManagement();

  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
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

        <RoomStatusTabs
          roomsData={roomsData}
          filterRooms={filterRooms}
          getStatusColor={getStatusColor}
          onRoomClick={handleRoomClick}
        />
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
