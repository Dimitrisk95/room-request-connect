
import { useState, useEffect } from "react";
import { Room } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context";

export const useRoomManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddReservation, setShowAddReservation] = useState(false);

  useEffect(() => {
    if (user?.hotelId) {
      fetchRooms();
    }
  }, [user?.hotelId]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', user?.hotelId);

      if (error) throw error;

      // Transform the data to match our Room type
      const transformedRooms: Room[] = data.map(room => ({
        id: room.id,
        roomNumber: room.room_number,
        type: room.type,
        status: room.status as "vacant" | "occupied" | "maintenance" | "cleaning",
        bedType: room.bed_type,
        floor: room.floor,
        capacity: room.capacity,
        hotelId: room.hotel_id
      }));

      setRoomsData(transformedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filterRooms = (rooms: Room[], floor: number | null = null) => {
    return rooms.filter((room) => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFloor = floor === null || room.floor === floor;
      return matchesSearch && matchesFloor;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-pending text-pending-foreground";
      case "vacant":
        return "bg-success text-success-foreground";
      case "maintenance":
        return "bg-destructive text-destructive-foreground";
      case "cleaning":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    roomsData,
    selectedRoom,
    setSelectedRoom,
    showAddReservation,
    setShowAddReservation,
    filterRooms,
    getStatusColor,
    fetchRooms, // Add this to allow manual refresh
  };
};
