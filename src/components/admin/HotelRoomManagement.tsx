
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import RoomAddDialog from "./RoomAddDialog";
import RoomsTable from "./RoomsTable";
import type { Room } from "@/types";

const HotelRoomManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Fetch rooms for the current hotel
  const fetchRooms = async () => {
    if (!user?.hotelId) {
      setRooms([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use the generated type for safer access
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", user.hotelId);

      if (error) throw error;

      // Map directly to the app's Room type, ensuring status is correctly typed
      const transformedRooms: Room[] = (data as Tables<"rooms">[] | null)?.map((room) => ({
        id: room.id,
        roomNumber: room.room_number,
        floor: room.floor,
        type: room.type,
        // Cast the status to the correct type
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
        <div className="flex justify-end mb-4">
          <RoomAddDialog
            open={showAddDialog}
            setOpen={setShowAddDialog}
            onRoomAdded={fetchRooms}
          />
        </div>
        <RoomsTable rooms={rooms} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default HotelRoomManagement;
