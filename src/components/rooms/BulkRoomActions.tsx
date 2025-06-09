
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Room } from "@/types";
import { RoomStatus, bulkUpdateRoomStatus } from "@/context/rooms/roomStatusHandlers";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";

interface BulkRoomActionsProps {
  selectedRooms: Room[];
  onRoomsUpdated: (rooms: Room[]) => void;
  onClearSelection: () => void;
}

export const BulkRoomActions = ({
  selectedRooms,
  onRoomsUpdated,
  onClearSelection
}: BulkRoomActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bulkStatus, setBulkStatus] = useState<RoomStatus | "">("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedRooms.length === 0 || !user) return;

    setIsUpdating(true);
    try {
      const roomIds = selectedRooms.map(room => room.id);
      const updatedRooms = await bulkUpdateRoomStatus(
        roomIds,
        bulkStatus as RoomStatus,
        user.id
      );

      onRoomsUpdated(updatedRooms);
      toast({
        title: "Rooms updated",
        description: `${selectedRooms.length} rooms updated to ${bulkStatus} status`,
      });

      setBulkStatus("");
      onClearSelection();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room statuses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectedRooms.length === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected
        </Badge>
        <span className="text-sm text-muted-foreground">
          Rooms: {selectedRooms.map(r => r.roomNumber).join(', ')}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Select value={bulkStatus} onValueChange={setBulkStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={handleBulkUpdate} 
          disabled={!bulkStatus || isUpdating}
          size="sm"
        >
          {isUpdating ? "Updating..." : "Update All"}
        </Button>

        <Button 
          variant="outline" 
          onClick={onClearSelection}
          size="sm"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
