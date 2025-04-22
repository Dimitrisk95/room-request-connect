
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Room } from "@/types";

interface RoomsTableProps {
  rooms: Room[];
  isLoading: boolean;
}

const RoomsTable = ({ rooms, isLoading }: RoomsTableProps) => {
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
                <Button variant="outline" size="icon" aria-label="Edit Room" disabled>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Delete Room" disabled>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoomsTable;
