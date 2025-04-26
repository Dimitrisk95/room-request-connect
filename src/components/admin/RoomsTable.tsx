
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Room } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoomsTableProps {
  rooms: Room[];
  isLoading: boolean;
  onEdit: (room: Room) => void;
  onRoomDeleted: () => void;
}

const RoomsTable = ({ rooms, isLoading, onEdit, onRoomDeleted }: RoomsTableProps) => {
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', deletingRoom.id);

      if (error) throw error;

      toast({
        title: "Room deleted",
        description: `Room ${deletingRoom.roomNumber} has been deleted successfully.`
      });
      
      onRoomDeleted();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingRoom(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading rooms...</div>;
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-4">
        No rooms added yet. Add your first room to get started.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Number</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Capacity</TableHead>
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
              <TableCell>{room.capacity}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onEdit(room)}
                    aria-label="Edit Room"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setDeletingRoom(room)}
                    aria-label="Delete Room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deletingRoom} onOpenChange={(open) => !open && setDeletingRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete room{' '}
              {deletingRoom?.roomNumber} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoomsTable;
