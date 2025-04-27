
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
import { useToast } from "@/components/ui/use-toast";
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'vacant':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoomType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatBedType = (bedType: string | undefined) => {
    if (!bedType) return 'N/A';
    return bedType.charAt(0).toUpperCase() + bedType.slice(1);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading rooms...</div>;
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-4 border rounded-md bg-muted/20 p-8">
        <h3 className="text-lg font-medium mb-2">No rooms found</h3>
        <p className="text-muted-foreground mb-4">Add your first room to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room No.</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Bed Type</TableHead>
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
                <TableCell>{formatRoomType(room.type)}</TableCell>
                <TableCell>{formatBedType(room.bedType)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(room.status)}`}>
                    {room.status === 'vacant' ? 'Available' : room.status.charAt(0).toUpperCase() + room.status.slice(1)}
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
      </div>

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
