
import { useState } from "react";
import { Room } from "@/types";
import { mockRooms } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export const useRoomManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomsData] = useState(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddReservation, setShowAddReservation] = useState(false);

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
  };
};
