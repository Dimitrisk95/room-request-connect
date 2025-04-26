
import { Room } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoomsGrid from "./RoomsGrid";

interface FloorSectionProps {
  floor: number;
  rooms: Room[];
  getStatusColor: (status: string) => string;
  onRoomClick: (room: Room) => void;
}

const FloorSection = ({ floor, rooms, getStatusColor, onRoomClick }: FloorSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor {floor}</CardTitle>
      </CardHeader>
      <CardContent>
        <RoomsGrid
          rooms={rooms}
          getStatusColor={getStatusColor}
          onRoomClick={onRoomClick}
          showCurrentGuest={true}
        />
      </CardContent>
    </Card>
  );
};

export default FloorSection;
