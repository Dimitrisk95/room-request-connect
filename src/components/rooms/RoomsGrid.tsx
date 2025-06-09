
import { Room } from "@/types";
import RoomCard from "./RoomCard";

interface RoomsGridProps {
  rooms: Room[];
  getStatusColor: (status: string) => string;
  onRoomClick: (room: Room) => void;
  onStatusUpdate?: (room: Room) => void;
  showCurrentGuest?: boolean;
  selectable?: boolean;
  selectedRooms?: Room[];
  onSelectionChange?: (room: Room, selected: boolean) => void;
}

const RoomsGrid = ({
  rooms,
  getStatusColor,
  onRoomClick,
  onStatusUpdate,
  showCurrentGuest = true,
  selectable = false,
  selectedRooms = [],
  onSelectionChange,
}: RoomsGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {rooms.map((room) => (
      <RoomCard
        key={room.id}
        room={room}
        getStatusColor={getStatusColor}
        onClick={onRoomClick}
        onStatusUpdate={onStatusUpdate}
        showCurrentGuest={showCurrentGuest}
        selectable={selectable}
        selected={selectedRooms.some(r => r.id === room.id)}
        onSelectionChange={onSelectionChange}
      />
    ))}
  </div>
);

export default RoomsGrid;
