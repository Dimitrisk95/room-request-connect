
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import RoomAddDialog from "./RoomAddDialog";
import RoomsTable from "./RoomsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Room } from "@/types";

const HotelRoomManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bed className="mr-2 h-5 w-5" />
          Hotel Room Management
        </CardTitle>
        <CardDescription>
          Manage the rooms in your hotel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
            <div className="w-full sm:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {roomTypes.map(type => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="vacant">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddRoomClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rooms
            </Button>
          </div>
        </div>
        
        <RoomsTable 
          rooms={filteredRooms} 
          isLoading={isLoading} 
          onEdit={handleEditRoom}
          onRoomDeleted={fetchRooms}
        />
        
        <RoomAddDialog
          open={showAddDialog}
          setOpen={setShowAddDialog}
          onRoomAdded={fetchRooms}
          editingRoom={editingRoom}
          onEditComplete={() => setEditingRoom(null)}
        />
      </CardContent>
    </Card>
  );
};

export default HotelRoomManagement;
