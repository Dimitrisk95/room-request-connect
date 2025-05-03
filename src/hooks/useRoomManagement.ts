
import { useState, useEffect, useCallback } from "react";
import { Room } from "@/types";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRoomManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddReservation, setShowAddReservation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    if (!user?.hotelId) {
      setRoomsData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching rooms for hotel:', user.hotelId);

      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", user.hotelId);

      if (error) {
        throw error;
      }

      if (data) {
        console.log('Rooms fetched successfully:', data.length);
        const transformedRooms = data.map((room) => ({
          id: room.id,
          roomNumber: room.room_number,
          floor: room.floor,
          type: room.type,
          bedType: room.bed_type as "single" | "double" | "queen" | "king" | "twin" | "suite",
          status: room.status as "vacant" | "occupied" | "maintenance" | "cleaning",
          capacity: room.capacity,
          room_code: room.room_code,
        }));
        setRoomsData(transformedRooms);
      }
    } catch (e: any) {
      console.error("Error fetching rooms:", e);
      setError(e.message);
      toast({
        title: "Error",
        description: "Failed to load rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.hotelId, toast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filterRooms = (rooms: Room[], floor: number | null) => {
    let filteredRooms = rooms;

    if (searchTerm) {
      filteredRooms = filteredRooms.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (floor !== null) {
      filteredRooms = filteredRooms.filter((room) => room.floor === floor);
    }

    return filteredRooms;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vacant":
        return "text-green-600 bg-green-100";
      case "occupied":
        return "text-blue-600 bg-blue-100";
      case "maintenance":
        return "text-orange-600 bg-orange-100";
      case "cleaning":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return {
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
    refetchRooms: fetchRooms,
  };
};
