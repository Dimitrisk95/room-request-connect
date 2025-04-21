
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
}: RoomCardProps) => {
  // Get border color based on room status
  const getBorderColor = () => {
    switch (room.status) {
      case "occupied":
        return "border-pending";
      case "maintenance":
        return "border-destructive";
      case "cleaning":
        return "border-warning";
      default:
        return "border-success";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getBorderColor()}`}
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
};

export default RoomCard;
