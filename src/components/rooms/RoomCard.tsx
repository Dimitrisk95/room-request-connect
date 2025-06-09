
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Room } from "@/types";
import { MoreVertical, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RoomCardProps {
  room: Room;
  getStatusColor: (status: string) => string;
  onClick: (room: Room) => void;
  onStatusUpdate?: (room: Room) => void;
  showCurrentGuest?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelectionChange?: (room: Room, selected: boolean) => void;
}

export const RoomCard = ({ 
  room, 
  getStatusColor, 
  onClick,
  onStatusUpdate,
  showCurrentGuest = false,
  selectable = false,
  selected = false,
  onSelectionChange
}: RoomCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get border color based on room status
  const getBorderColor = () => {
    switch (room.status) {
      case "occupied":
        return "border-blue-200";
      case "maintenance":
        return "border-orange-200";
      case "cleaning":
        return "border-purple-200";
      default:
        return "border-green-200";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable && onSelectionChange) {
      e.stopPropagation();
      onSelectionChange(room, !selected);
    } else {
      onClick(room);
    }
  };

  const handleStatusUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusUpdate) {
      onStatusUpdate(room);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(room, checked);
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${getBorderColor()} ${
        selected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md hover:border-primary/30'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {selectable && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox 
            checked={selected}
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {onStatusUpdate && isHovered && (
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStatusUpdateClick}>
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className={`${selectable ? 'pl-6' : ''}`}>
        <div className="font-medium text-lg">Room {room.roomNumber}</div>
        <div className="text-sm text-muted-foreground mb-2">
          {room.type} • Floor {room.floor}
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          {room.capacity} guests • {room.bedType} bed
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${getStatusColor(room.status)} text-xs`}>
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </Badge>
          
          {room.room_code && (
            <div className="text-xs text-muted-foreground">
              Code: {room.room_code}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
