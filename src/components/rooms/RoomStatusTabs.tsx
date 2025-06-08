
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RoomsGrid from "./RoomsGrid";
import { Room } from "@/types";

interface RoomStatusTabsProps {
  roomsData: Room[];
  filterRooms: (rooms: Room[], floor: number | null) => Room[];
  getStatusColor: (status: string) => string;
  onRoomClick: (room: Room) => void;
}

const RoomStatusTabs = ({ roomsData, filterRooms, getStatusColor, onRoomClick }: RoomStatusTabsProps) => {
  const statusCounts = {
    all: roomsData.length,
    vacant: roomsData.filter(room => room.status === "vacant").length,
    occupied: roomsData.filter(room => room.status === "occupied").length,
    maintenance: roomsData.filter(room => room.status === "maintenance").length,
    cleaning: roomsData.filter(room => room.status === "cleaning").length,
  };

  const getFilteredRooms = (status: string) => {
    return status === "all" ? roomsData : roomsData.filter(room => room.status === status);
  };

  return (
    <Tabs defaultValue="all" className="w-full" data-tutorial="room-tabs">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all" className="flex items-center gap-2">
          All
          <Badge variant="secondary" className="text-xs">
            {statusCounts.all}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="vacant" className="flex items-center gap-2">
          Vacant
          <Badge variant="secondary" className="text-xs">
            {statusCounts.vacant}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="occupied" className="flex items-center gap-2">
          Occupied
          <Badge variant="secondary" className="text-xs">
            {statusCounts.occupied}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="maintenance" className="flex items-center gap-2">
          Maintenance
          <Badge variant="secondary" className="text-xs">
            {statusCounts.maintenance}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="cleaning" className="flex items-center gap-2">
          Cleaning
          <Badge variant="secondary" className="text-xs">
            {statusCounts.cleaning}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {["all", "vacant", "occupied", "maintenance", "cleaning"].map((status) => (
        <TabsContent key={status} value={status} className="mt-6">
          <RoomsGrid
            rooms={getFilteredRooms(status)}
            onRoomClick={onRoomClick}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RoomStatusTabs;
