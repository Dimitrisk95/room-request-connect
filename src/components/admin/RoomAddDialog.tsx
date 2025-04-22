
import { useState } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";

interface RoomAddDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRoomAdded: () => void;
}

type RoomStatus = "vacant" | "occupied" | "maintenance" | "cleaning";

const RoomAddDialog = ({ open, setOpen, onRoomAdded }: RoomAddDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    floor: 1,
    type: "standard",
    status: "vacant" as RoomStatus,
    capacity: 2,
  });

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      if (!user?.hotelId) {
        throw new Error("Hotel ID is required");
      }

      // Use generated type for "rooms" table inserts.
      const roomToInsert: TablesInsert<"rooms"> = {
        room_number: newRoom.roomNumber,
        floor: newRoom.floor,
        type: newRoom.type,
        status: newRoom.status,
        hotel_id: user.hotelId,
        capacity: newRoom.capacity,
      };

      const { error } = await supabase.from("rooms").insert([roomToInsert]);
      if (error) throw error;

      toast({
        title: "Room added successfully",
        description: `Room ${newRoom.roomNumber} has been added.`,
      });

      setNewRoom({
        roomNumber: "",
        floor: 1,
        type: "standard",
        status: "vacant",
        capacity: 2,
      });
      setOpen(false);
      onRoomAdded();
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "Failed to add room",
        description: "There was an error adding the room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
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
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Add a new room to your hotel
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddRoom}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
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
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <select
                id="type"
                className="w-full p-2 border rounded-md bg-background"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
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
                value={newRoom.status}
                onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as RoomStatus })}
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
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomAddDialog;
