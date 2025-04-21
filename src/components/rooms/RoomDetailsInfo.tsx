
import { Badge } from "@/components/ui/badge";
import { Room } from "@/types";

interface RoomDetailsInfoProps {
  room: Room;
}

const RoomDetailsInfo = ({ room }: RoomDetailsInfoProps) => (
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <p className="text-sm font-medium">Room Number</p>
      <p>{room.roomNumber}</p>
    </div>
    <div>
      <p className="text-sm font-medium">Room Type</p>
      <p>{room.type}</p>
    </div>
    <div>
      <p className="text-sm font-medium">Floor</p>
      <p>{room.floor}</p>
    </div>
    <div>
      <p className="text-sm font-medium">Status</p>
      <Badge className="mt-1">{room.status}</Badge>
    </div>
    <div>
      <p className="text-sm font-medium">Capacity</p>
      <p>{room.capacity} guests</p>
    </div>
    {room.currentGuest && (
      <div>
        <p className="text-sm font-medium">Current Guest</p>
        <p>{room.currentGuest.name}</p>
      </div>
    )}
  </div>
);

export default RoomDetailsInfo;
