
import { Badge } from "@/components/ui/badge";
import { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  getStatusColor: (status: string) => string;
  onClick: (room: Room) => void;
  showCurrentGuest?: boolean;
}

export const RoomCard = ({ 
  room, 
  getStatusColor, 
  onClick,
  showCurrentGuest = true
}: RoomCardProps) => (
  <div
    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
      room.status === "occupied" ? "border-pending" : 
      room.status === "maintenance" ? "border-destructive" : 
      room.status === "cleaning" ? "border-warning" : 
      "border-success"
    }`}
    onClick={() => onClick(room)}
  >
    <div className="font-medium">Room {room.roomNumber}</div>
    <div className="text-xs text-muted-foreground">{room.type}</div>
    <Badge variant="outline" className={`mt-2 ${getStatusColor(room.status)}`}>
      {room.status}
    </Badge>
    {showCurrentGuest && room.currentGuest && (
      <div className="mt-2 text-xs truncate">
        {room.currentGuest.name}
      </div>
    )}
  </div>
);

export default RoomCard;
