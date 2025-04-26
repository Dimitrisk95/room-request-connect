
import DashboardShell from "@/components/ui/dashboard-shell";
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import RoomSearch from "@/components/rooms/RoomSearch";
import RoomStatusTabs from "@/components/rooms/RoomStatusTabs";
import { Reservation } from "@/types";
import { useState, useEffect } from "react";

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

  // Get stored reservations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hotel-reservations');
    if (stored) {
      try {
        setReservations(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored reservations", e);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hotel-reservations' && e.newValue) {
        try {
          setReservations(JSON.parse(e.newValue));
        } catch (e) {
          console.error("Failed to parse stored reservations from other page", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Store reservations when they change
  useEffect(() => {
    localStorage.setItem('hotel-reservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleReservationAdded = (newReservation: Reservation) => {
    setReservations(prev => {
      const exists = prev.findIndex(r => r.id === newReservation.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = newReservation;
        return updated;
      }
      return [...prev, newReservation];
    });
  };

  const handleReservationDeleted = (reservationId: string) => {
    setReservations(prev => prev.filter(r => r.id !== reservationId));
  };

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
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
        onReservationAdded={handleReservationAdded}
        onReservationUpdated={handleReservationAdded}
        onReservationDeleted={handleReservationDeleted}
      />

      <AddReservationDialog
        open={showAddReservation}
        onOpenChange={setShowAddReservation}
        onReservationAdded={handleReservationAdded}
      />
    </DashboardShell>
  );
};

export default RoomManagement;
