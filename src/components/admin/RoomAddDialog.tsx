
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";
import type { Room } from "@/types";

interface RoomAddDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRoomAdded: () => void;
  editingRoom?: Room | null;
  onEditComplete?: () => void;
}

type RoomStatus = "vacant" | "occupied" | "maintenance" | "cleaning";

const RoomAddDialog = ({ open, setOpen, onRoomAdded, editingRoom, onEditComplete }: RoomAddDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [room, setRoom] = useState({
    roomNumber: "",
    floor: 1,
    type: "standard",
    status: "vacant" as RoomStatus,
    capacity: 2,
  });

  useEffect(() => {
    if (editingRoom) {
      setRoom({
        roomNumber: editingRoom.roomNumber,
        floor: editingRoom.floor,
        type: editingRoom.type,
        status: editingRoom.status,
        capacity: editingRoom.capacity,
      });
    } else {
      setRoom({
        roomNumber: "",
        floor: 1,
        type: "standard",
        status: "vacant",
        capacity: 2,
      });
    }
  }, [editingRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?.hotelId) {
        throw new Error("Hotel ID is required");
      }

      if (editingRoom) {
        // Update existing room
        const { error } = await supabase
          .from("rooms")
          .update({
            room_number: room.roomNumber,
            floor: room.floor,
            type: room.type,
            status: room.status,
            capacity: room.capacity,
          })
          .eq('id', editingRoom.id);

        if (error) throw error;

        toast({
          title: "Room updated successfully",
          description: `Room ${room.roomNumber} has been updated.`,
        });
      } else {
        // Create new room
        const roomToInsert: TablesInsert<"rooms"> = {
          room_number: room.roomNumber,
          floor: room.floor,
          type: room.type,
          status: room.status,
          hotel_id: user.hotelId,
          capacity: room.capacity,
        };

        const { error } = await supabase.from("rooms").insert([roomToInsert]);
        if (error) throw error;

        toast({
          title: "Room added successfully",
          description: `Room ${room.roomNumber} has been added.`,
        });
      }

      setRoom({
        roomNumber: "",
        floor: 1,
        type: "standard",
        status: "vacant",
        capacity: 2,
      });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          <DialogDescription>
            {editingRoom ? 'Update room details' : 'Add a new room to your hotel'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                value={room.roomNumber}
                onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })}
                placeholder="e.g., 101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                value={room.floor}
                onChange={(e) => setRoom({ ...room, floor: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <select
                id="type"
                className="w-full p-2 border rounded-md bg-background"
                value={room.type}
                onChange={(e) => setRoom({ ...room, type: e.target.value })}
                required
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full p-2 border rounded-md bg-background"
                value={room.status}
                onChange={(e) => setRoom({ ...room, status: e.target.value as RoomStatus })}
                required
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={room.capacity}
                onChange={(e) => setRoom({ ...room, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (editingRoom ? "Updating..." : "Adding...") : (editingRoom ? "Update Room" : "Add Room")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomAddDialog;
