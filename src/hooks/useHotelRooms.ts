
import { useState, useEffect } from "react";
import { Room } from "@/types";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export const useHotelRooms = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchRooms = async () => {
    if (!user?.hotelId) {
      setRooms([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", user.hotelId);

      if (error) throw error;

      const transformedRooms: Room[] = (data as Tables<"rooms">[] | null)?.map((room) => ({
        id: room.id,
        roomNumber: room.room_number,
        floor: room.floor,
        type: room.type,
        bedType: room.bed_type as "single" | "double" | "queen" | "king" | "twin" | "suite",
        status: room.status as "vacant" | "occupied" | "maintenance" | "cleaning",
        capacity: room.capacity,
      })) || [];
      
      setRooms(transformedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Failed to load rooms",
        description: "There was an error loading the rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user?.hotelId]);

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowAddDialog(true);
  };

  const handleAddRoomClick = () => {
    setEditingRoom(null);
    setShowAddDialog(true);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const roomTypes = [...new Set(rooms.map(room => room.type))];

  return {
    isLoading,
    rooms: filteredRooms,
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
  };
};
