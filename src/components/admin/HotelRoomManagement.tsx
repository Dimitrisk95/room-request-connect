
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bed, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  status: "vacant" | "occupied" | "maintenance" | "cleaning";
}

const HotelRoomManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    floor: 1,
    type: "standard", // standard, deluxe, suite, etc.
    status: "vacant" as const
  });

  // Fetch rooms for the current hotel
  const fetchRooms = async () => {
    if (!user?.hotelId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", user.hotelId);
      
      if (error) throw error;
      
      // Transform to match our Room interface
      const transformedRooms = data?.map(room => ({
        id: room.id,
        roomNumber: room.room_number,
        floor: room.floor,
        type: room.type,
        status: room.status
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

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      if (!user?.hotelId) {
        throw new Error("Hotel ID is required");
      }

      const { data, error } = await supabase
        .from("rooms")
        .insert([{
          room_number: newRoom.roomNumber,
          floor: newRoom.floor,
          type: newRoom.type,
          status: newRoom.status,
          hotel_id: user.hotelId
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Room added successfully",
        description: `Room ${newRoom.roomNumber} has been added.`,
      });

      // Reset form and refresh rooms
      setNewRoom({
        roomNumber: "",
        floor: 1,
        type: "standard",
        status: "vacant"
      });
      setShowAddDialog(false);
      fetchRooms();
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

  // Check if we need to show the "No hotel" message
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
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
                      className="w-full p-2 border rounded-md"
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
                      className="w-full p-2 border rounded-md"
                      value={newRoom.status}
                      onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as any })}
                      required
                    >
                      <option value="vacant">Vacant</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
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
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-4">
            No rooms added yet. Add your first room to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell className="capitalize">{room.type}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        room.status === 'vacant' 
                          ? 'bg-green-100 text-green-800' 
                          : room.status === 'occupied' 
                          ? 'bg-blue-100 text-blue-800'
                          : room.status === 'maintenance'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {room.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelRoomManagement;
