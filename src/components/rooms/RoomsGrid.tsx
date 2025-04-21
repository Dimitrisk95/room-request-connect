
import { Room } from "@/types";
import RoomCard from "./RoomCard";

interface RoomsGridProps {
  rooms: Room[];
  getStatusColor: (status: string) => string;
  onRoomClick: (room: Room) => void;
  showCurrentGuest?: boolean; // For conditional display if needed in future
}

const RoomsGrid = ({
  rooms,
  getStatusColor,
  onRoomClick,
}: RoomsGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {rooms.map((room) => (
      <RoomCard
        key={room.id}
        room={room}
        getStatusColor={getStatusColor}
        onClick={onRoomClick}
      />
    ))}
  </div>
);

export default RoomsGrid;
