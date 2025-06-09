
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Room } from "@/types";
import { RoomStatus, updateRoomStatus } from "@/context/rooms/roomStatusHandlers";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface RoomStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  onStatusUpdated: (room: Room) => void;
}

export const RoomStatusDialog = ({
  open,
  onOpenChange,
  room,
  onStatusUpdated
}: RoomStatusDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState<RoomStatus | "">("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!room || !newStatus || !user) return;

    setIsUpdating(true);
    try {
      const updatedRoom = await updateRoomStatus(
        room.id,
        newStatus as RoomStatus,
        user.id,
        notes || undefined
      );

      onStatusUpdated(updatedRoom);
      toast({
        title: "Room status updated",
        description: `Room ${room.roomNumber} status changed to ${newStatus}`,
      });

      onOpenChange(false);
      setNewStatus("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setNewStatus(value as RoomStatus | "");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vacant":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "cleaning":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "Room is available for new guests";
      case "occupied":
        return "Room is currently occupied by guests";
      case "maintenance":
        return "Room needs maintenance or repairs";
      case "cleaning":
        return "Room is being cleaned or serviced";
    }
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Room Status - {room.roomNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Current Status</Label>
            <div className="mt-1">
              <Badge className={getStatusColor(room.status)}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacant">
                  <div className="flex flex-col items-start">
                    <span>Vacant</span>
                    <span className="text-xs text-muted-foreground">
                      {getStatusDescription("vacant")}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="occupied">
                  <div className="flex flex-col items-start">
                    <span>Occupied</span>
                    <span className="text-xs text-muted-foreground">
                      {getStatusDescription("occupied")}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="maintenance">
                  <div className="flex flex-col items-start">
                    <span>Maintenance</span>
                    <span className="text-xs text-muted-foreground">
                      {getStatusDescription("maintenance")}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="cleaning">
                  <div className="flex flex-col items-start">
                    <span>Cleaning</span>
                    <span className="text-xs text-muted-foreground">
                      {getStatusDescription("cleaning")}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={!newStatus || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
