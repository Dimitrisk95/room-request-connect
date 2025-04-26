
import { Room } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FloorSection from "./FloorSection";

interface RoomStatusTabsProps {
  roomsData: Room[];
  filterRooms: (rooms: Room[], floor: number | null) => Room[];
  getStatusColor: (status: string) => string;
  onRoomClick: (room: Room) => void;
}

const RoomStatusTabs = ({ roomsData, filterRooms, getStatusColor, onRoomClick }: RoomStatusTabsProps) => {
  const floorGroups = roomsData.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(floorGroups).map(Number).sort();

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Rooms</TabsTrigger>
        <TabsTrigger value="occupied">Occupied</TabsTrigger>
        <TabsTrigger value="vacant">Vacant</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        {floors.map((floor) => (
          <FloorSection
            key={floor}
            floor={floor}
            rooms={filterRooms(floorGroups[floor], floor)}
            getStatusColor={getStatusColor}
            onRoomClick={onRoomClick}
          />
        ))}
      </TabsContent>

      <TabsContent value="occupied" className="space-y-6">
        <FloorSection
          floor={0}
          rooms={filterRooms(roomsData.filter((r) => r.status === "occupied"), null)}
          getStatusColor={getStatusColor}
          onRoomClick={onRoomClick}
        />
      </TabsContent>

      <TabsContent value="vacant" className="space-y-6">
        <FloorSection
          floor={0}
          rooms={filterRooms(roomsData.filter((r) => r.status === "vacant"), null)}
          getStatusColor={getStatusColor}
          onRoomClick={onRoomClick}
        />
      </TabsContent>

      <TabsContent value="maintenance" className="space-y-6">
        <FloorSection
          floor={0}
          rooms={filterRooms(
            roomsData.filter((r) =>
              ["maintenance", "cleaning"].includes(r.status)
            ),
            null
          )}
          getStatusColor={getStatusColor}
          onRoomClick={onRoomClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default RoomStatusTabs;
