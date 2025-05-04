
import { useState } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Room } from "@/types";
import { SingleRoomForm } from "./room-dialog/SingleRoomForm";
import { MultipleRoomsForm } from "./room-dialog/MultipleRoomsForm";
import { generateRoomCode } from "@/utils/codeGenerator";
import { useHotelCode } from "@/hooks/useHotelCode";

interface RoomAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomAdded?: () => void;
  onRoomsAdded?: (count: number) => void;
  editingRoom?: Room | null;
  onEditComplete?: () => void;
}

export const RoomAddDialog = ({ 
  open, 
  onOpenChange, 
  onRoomAdded, 
  onRoomsAdded, 
  editingRoom, 
  onEditComplete 
}: RoomAddDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("single-room");
  const { hotelCode } = useHotelCode();

  const handleSingleRoomSubmit = async (roomData: Partial<Room>) => {
    console.log("Submitting room with data:", roomData);
    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // For room creation during setup, we'll need to handle the case where
      // the hotel hasn't been created yet
      const hotelId = user?.hotelId;
      
      // During setup, if no hotelId yet, we'll store the room temporarily
      // These rooms will be properly created after the hotel is created
      if (!hotelId && !editingRoom) {
        console.log("No hotel ID available yet, this is likely during setup");
        if (onRoomsAdded) {
          onRoomsAdded(1);
          toast({
            title: "Room added",
            description: `Room ${roomData.roomNumber} has been prepared for your hotel.`,
          });
          onOpenChange(false);
          return;
        }
      }

      if (editingRoom) {
        console.log("Updating existing room:", editingRoom.id);
        const { error } = await supabase
          .from("rooms")
          .update({
            room_number: roomData.roomNumber,
            floor: roomData.floor,
            type: roomData.type,
            bed_type: roomData.bedType,
            status: roomData.status,
            capacity: roomData.capacity,
          })
          .eq('id', editingRoom.id);

        if (error) {
          console.error("Room update error:", error);
          throw error;
        }

        toast({
          title: "Room updated successfully",
          description: `Room ${roomData.roomNumber} has been updated.`,
        });
      } else if (hotelId) {
        // Generate a room code
        const roomCode = generateRoomCode(hotelCode || 'HOTEL', roomData.roomNumber || '000');
        
        console.log("Creating new room for hotel:", hotelId);
        const { error } = await supabase
          .from("rooms")
          .insert([{
            room_number: roomData.roomNumber,
            floor: roomData.floor,
            type: roomData.type,
            bed_type: roomData.bedType,
            status: roomData.status,
            capacity: roomData.capacity,
            hotel_id: hotelId,
            room_code: roomCode
          }]);

        if (error) {
          console.error("Room creation error:", error);
          throw error;
        }

        toast({
          title: "Room added successfully",
          description: `Room ${roomData.roomNumber} has been added with access code.`,
        });
      }

      onOpenChange(false);
      if (onRoomAdded) onRoomAdded();
      if (onRoomsAdded) onRoomsAdded(1);
      if (editingRoom && onEditComplete) {
        onEditComplete();
      }
    } catch (error: any) {
      console.error("Error saving room:", error);
      toast({
        title: "Failed to save room",
        description: error.message || "There was an error saving the room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultipleRoomsSubmit = async ({ roomNumbers, commonFields }: { roomNumbers: string, commonFields: Partial<Room> }) => {
    console.log("Submitting multiple rooms:", roomNumbers, commonFields);
    setIsSubmitting(true);

    try {
      const numbers = roomNumbers
        .split(/[\s,;]+/)
        .map(num => num.trim())
        .filter(num => num !== "");

      if (numbers.length === 0) {
        throw new Error("Please enter at least one room number");
      }
      
      // For room creation during setup, we'll need to handle the case where
      // the hotel hasn't been created yet
      const hotelId = user?.hotelId;
      
      // During setup, if no hotelId yet, we'll store the room count temporarily
      // These rooms will be properly created after the hotel is created
      if (!hotelId) {
        console.log("No hotel ID available yet, this is likely during setup");
        if (onRoomsAdded) {
          onRoomsAdded(numbers.length);
          toast({
            title: "Rooms added",
            description: `${numbers.length} rooms have been prepared for your hotel.`,
          });
          onOpenChange(false);
          return;
        }
      }
      
      if (hotelId) {
        const roomsToInsert = numbers.map(roomNumber => ({
          room_number: roomNumber,
          floor: commonFields.floor,
          type: commonFields.type,
          bed_type: commonFields.bedType,
          status: commonFields.status,
          capacity: commonFields.capacity,
          hotel_id: hotelId,
          room_code: generateRoomCode(hotelCode || 'HOTEL', roomNumber)
        }));

        console.log("Creating multiple rooms for hotel:", hotelId);
        const { error } = await supabase.from("rooms").insert(roomsToInsert);
        
        if (error) {
          console.error("Multiple room creation error:", error);
          throw error;
        }

        toast({
          title: "Rooms added successfully",
          description: `${numbers.length} rooms have been added with access codes.`,
        });
      }

      onOpenChange(false);
      if (onRoomAdded) onRoomAdded();
      if (onRoomsAdded) onRoomsAdded(numbers.length);
    } catch (error: any) {
      console.error("Error saving rooms:", error);
      toast({
        title: "Failed to save rooms",
        description: error instanceof Error ? error.message : "There was an error saving the rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingRoom ? 'Edit Room' : 'Add Room'}</DialogTitle>
          <DialogDescription>
            {editingRoom ? 'Update room details' : 'Add new rooms to your hotel'}
          </DialogDescription>
        </DialogHeader>
        
        {!editingRoom && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single-room">Single Room</TabsTrigger>
              <TabsTrigger value="multiple-rooms">Multiple Rooms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="single-room">
              <SingleRoomForm
                onSubmit={handleSingleRoomSubmit}
                editingRoom={editingRoom}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="multiple-rooms">
              <MultipleRoomsForm
                onSubmit={handleMultipleRoomsSubmit}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        )}
        
        {editingRoom && (
          <SingleRoomForm
            onSubmit={handleSingleRoomSubmit}
            editingRoom={editingRoom}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoomAddDialog;
