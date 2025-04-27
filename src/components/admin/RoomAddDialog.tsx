
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import type { Room } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface RoomAddDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRoomAdded: () => void;
  editingRoom?: Room | null;
  onEditComplete?: () => void;
}

type RoomStatus = "vacant" | "occupied" | "maintenance" | "cleaning";
type BedType = "single" | "double" | "queen" | "king" | "twin" | "suite";

const RoomAddDialog = ({ open, setOpen, onRoomAdded, editingRoom, onEditComplete }: RoomAddDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("single-room");
  
  // Single room state
  const [room, setRoom] = useState({
    roomNumber: "",
    floor: 1,
    type: "standard",
    bedType: "single" as BedType,
    status: "vacant" as RoomStatus,
    capacity: 2,
  });

  // Multiple rooms state
  const [multipleRooms, setMultipleRooms] = useState({
    roomNumbers: "",
    floor: 1,
    type: "standard",
    bedType: "single" as BedType,
    status: "vacant" as RoomStatus,
    capacity: 2,
  });

  useEffect(() => {
    if (editingRoom) {
      setRoom({
        roomNumber: editingRoom.roomNumber,
        floor: editingRoom.floor,
        type: editingRoom.type,
        bedType: editingRoom.bedType || "single",
        status: editingRoom.status,
        capacity: editingRoom.capacity,
      });
      setActiveTab("single-room");
    } else {
      setRoom({
        roomNumber: "",
        floor: 1,
        type: "standard",
        bedType: "single",
        status: "vacant",
        capacity: 2,
      });
    }
  }, [editingRoom, open]);

  const handleSingleRoomSubmit = async (e: React.FormEvent) => {
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
            bed_type: room.bedType,
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
          bed_type: room.bedType,
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
        bedType: "single",
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

  const handleMultipleRoomsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?.hotelId) {
        throw new Error("Hotel ID is required");
      }

      // Parse room numbers from the textarea
      const roomNumbers = multipleRooms.roomNumbers
        .split(/[\s,;]+/) // Split by spaces, commas, or semicolons
        .map(num => num.trim())
        .filter(num => num !== ""); // Remove empty strings

      if (roomNumbers.length === 0) {
        throw new Error("Please enter at least one room number");
      }

      // Create an array of rooms to insert
      const roomsToInsert = roomNumbers.map(roomNumber => ({
        room_number: roomNumber,
        floor: multipleRooms.floor,
        type: multipleRooms.type,
        bed_type: multipleRooms.bedType,
        status: multipleRooms.status,
        hotel_id: user.hotelId,
        capacity: multipleRooms.capacity,
      }));

      const { error } = await supabase.from("rooms").insert(roomsToInsert);
      if (error) throw error;

      toast({
        title: "Rooms added successfully",
        description: `${roomNumbers.length} rooms have been added.`,
      });

      setMultipleRooms({
        roomNumbers: "",
        floor: 1,
        type: "standard",
        bedType: "single",
        status: "vacant",
        capacity: 2,
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
              <form onSubmit={handleSingleRoomSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="roomNumber"
                      value={room.roomNumber}
                      onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })}
                      placeholder="e.g., 101"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        type="number"
                        min="1"
                        value={room.floor}
                        onChange={(e) => setRoom({ ...room, floor: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Max Occupancy</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={room.capacity}
                        onChange={(e) => setRoom({ ...room, capacity: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Room Type</Label>
                      <select
                        id="type"
                        className="w-full p-2 border rounded-md bg-background"
                        value={room.type}
                        onChange={(e) => setRoom({ ...room, type: e.target.value })}
                      >
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                        <option value="executive">Executive</option>
                        <option value="family">Family</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedType">Bed Type</Label>
                      <select
                        id="bedType"
                        className="w-full p-2 border rounded-md bg-background"
                        value={room.bedType}
                        onChange={(e) => setRoom({ ...room, bedType: e.target.value as BedType })}
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="queen">Queen</option>
                        <option value="king">King</option>
                        <option value="twin">Twin</option>
                        <option value="suite">Suite</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full p-2 border rounded-md bg-background"
                      value={room.status}
                      onChange={(e) => setRoom({ ...room, status: e.target.value as RoomStatus })}
                    >
                      <option value="vacant">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (editingRoom ? "Updating..." : "Adding...") : (editingRoom ? "Update Room" : "Add Room")}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="multiple-rooms">
              <form onSubmit={handleMultipleRoomsSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumbers">Room Numbers <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="roomNumbers"
                      value={multipleRooms.roomNumbers}
                      onChange={(e) => setMultipleRooms({ ...multipleRooms, roomNumbers: e.target.value })}
                      placeholder="Enter room numbers separated by commas or spaces (e.g. 101, 102, 103)"
                      required
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">Enter room numbers separated by commas, spaces, or line breaks (e.g., 101, 102, 103)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="multiFloor">Floor</Label>
                      <Input
                        id="multiFloor"
                        type="number"
                        min="1"
                        value={multipleRooms.floor}
                        onChange={(e) => setMultipleRooms({ ...multipleRooms, floor: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="multiCapacity">Max Occupancy</Label>
                      <Input
                        id="multiCapacity"
                        type="number"
                        min="1"
                        value={multipleRooms.capacity}
                        onChange={(e) => setMultipleRooms({ ...multipleRooms, capacity: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="multiType">Room Type</Label>
                      <select
                        id="multiType"
                        className="w-full p-2 border rounded-md bg-background"
                        value={multipleRooms.type}
                        onChange={(e) => setMultipleRooms({ ...multipleRooms, type: e.target.value })}
                      >
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                        <option value="executive">Executive</option>
                        <option value="family">Family</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="multiBedType">Bed Type</Label>
                      <select
                        id="multiBedType"
                        className="w-full p-2 border rounded-md bg-background"
                        value={multipleRooms.bedType}
                        onChange={(e) => setMultipleRooms({ ...multipleRooms, bedType: e.target.value as BedType })}
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="queen">Queen</option>
                        <option value="king">King</option>
                        <option value="twin">Twin</option>
                        <option value="suite">Suite</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="multiStatus">Status</Label>
                    <select
                      id="multiStatus"
                      className="w-full p-2 border rounded-md bg-background"
                      value={multipleRooms.status}
                      onChange={(e) => setMultipleRooms({ ...multipleRooms, status: e.target.value as RoomStatus })}
                    >
                      <option value="vacant">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding Rooms..." : "Add Multiple Rooms"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        )}
        
        {editingRoom && (
          <form onSubmit={handleSingleRoomSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number <span className="text-red-500">*</span></Label>
                <Input
                  id="roomNumber"
                  value={room.roomNumber}
                  onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })}
                  placeholder="e.g., 101"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    min="1"
                    value={room.floor}
                    onChange={(e) => setRoom({ ...room, floor: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Max Occupancy</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={room.capacity}
                    onChange={(e) => setRoom({ ...room, capacity: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <select
                    id="type"
                    className="w-full p-2 border rounded-md bg-background"
                    value={room.type}
                    onChange={(e) => setRoom({ ...room, type: e.target.value })}
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="executive">Executive</option>
                    <option value="family">Family</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedType">Bed Type</Label>
                  <select
                    id="bedType"
                    className="w-full p-2 border rounded-md bg-background"
                    value={room.bedType}
                    onChange={(e) => setRoom({ ...room, bedType: e.target.value as BedType })}
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                    <option value="twin">Twin</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full p-2 border rounded-md bg-background"
                  value={room.status}
                  onChange={(e) => setRoom({ ...room, status: e.target.value as RoomStatus })}
                >
                  <option value="vacant">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Room"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoomAddDialog;
