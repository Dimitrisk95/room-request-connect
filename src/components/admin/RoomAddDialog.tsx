
import { useState } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Room } from "@/types";
import { SingleRoomForm } from "./room-dialog/SingleRoomForm";
import { MultipleRoomsForm } from "./room-dialog/MultipleRoomsForm";

interface RoomAddDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRoomAdded: () => void;
  editingRoom?: Room | null;
  onEditComplete?: () => void;
}

export const RoomAddDialog = ({ open, setOpen, onRoomAdded, editingRoom, onEditComplete }: RoomAddDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("single-room");

  const handleSingleRoomSubmit = async (roomData: Partial<Room>) => {
    setIsSubmitting(true);

    try {
      if (!user?.hotelId) {
        throw new Error("Hotel ID is required");
      }

      if (editingRoom) {
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

        if (error) throw error;

        toast({
          title: "Room updated successfully",
          description: `Room ${roomData.roomNumber} has been updated.`,
        });
      } else {
        const { error } = await supabase
          .from("rooms")
          .insert([{
            room_number: roomData.roomNumber,
            floor: roomData.floor,
            type: roomData.type,
            bed_type: roomData.bedType,
            status: roomData.status,
            capacity: roomData.capacity,
            hotel_id: user.hotelId,
          }]);

        if (error) throw error;

        toast({
          title: "Room added successfully",
          description: `Room ${roomData.roomNumber} has been added.`,
        });
      }

      setOpen(false);
      onRoomAdded();
      if (editingRoom && onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error("Error saving room:", error);
      toast({
        title: "Failed to save room",
        description: "There was an error saving the room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultipleRoomsSubmit = async ({ roomNumbers, commonFields }: { roomNumbers: string, commonFields: Partial<Room> }) => {
    setIsSubmitting(true);

    try {
      if (!user?.hotelId) {
        throw new Error("Hotel ID is required");
      }

      const numbers = roomNumbers
        .split(/[\s,;]+/)
        .map(num => num.trim())
        .filter(num => num !== "");

      if (numbers.length === 0) {
        throw new Error("Please enter at least one room number");
      }

      const roomsToInsert = numbers.map(roomNumber => ({
        room_number: roomNumber,
        floor: commonFields.floor,
        type: commonFields.type,
        bed_type: commonFields.bedType,
        status: commonFields.status,
        capacity: commonFields.capacity,
        hotel_id: user.hotelId,
      }));

      const { error } = await supabase.from("rooms").insert(roomsToInsert);
      if (error) throw error;

      toast({
        title: "Rooms added successfully",
        description: `${numbers.length} rooms have been added.`,
      });

      setOpen(false);
      onRoomAdded();
    } catch (error) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
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
