
import { useState } from "react";
import { Room } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RoomCodesTableProps {
  rooms: Room[];
}

const RoomCodesTable: React.FC<RoomCodesTableProps> = ({ rooms }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Number</TableHead>
            <TableHead>Room Code</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.roomNumber}</TableCell>
              <TableCell className="font-mono">
                {room.room_code || "Not set"}
              </TableCell>
              <TableCell>{room.floor}</TableCell>
              <TableCell className="capitalize">{room.type}</TableCell>
              <TableCell className="text-right">
                {room.room_code && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(room.room_code || "")}
                    disabled={!room.room_code}
                  >
                    {copiedCode === room.room_code ? "Copied!" : "Copy Code"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoomCodesTable;
