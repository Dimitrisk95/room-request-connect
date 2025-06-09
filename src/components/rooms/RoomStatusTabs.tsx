
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RoomsGrid from "./RoomsGrid";
import { BulkRoomActions } from "./BulkRoomActions";
import { Room } from "@/types";

interface RoomStatusTabsProps {
  roomsData: Room[];
  filterRooms: (rooms: Room[], floor: number | null) => Room[];
  getStatusColor: (status: string) => string;
  onRoomClick: (room: Room) => void;
  onStatusUpdate?: (room: Room) => void;
  onRoomsUpdated?: (rooms: Room[]) => void;
}

const RoomStatusTabs = ({ 
  roomsData, 
  filterRooms, 
  getStatusColor, 
  onRoomClick, 
  onStatusUpdate,
  onRoomsUpdated 
}: RoomStatusTabsProps) => {
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

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

  const handleSelectionChange = (room: Room, selected: boolean) => {
    if (selected) {
      setSelectedRooms(prev => [...prev, room]);
    } else {
      setSelectedRooms(prev => prev.filter(r => r.id !== room.id));
    }
  };

  const handleBulkModeToggle = () => {
    setBulkMode(!bulkMode);
    setSelectedRooms([]);
  };

  const handleRoomsUpdated = (updatedRooms: Room[]) => {
    if (onRoomsUpdated) {
      onRoomsUpdated(updatedRooms);
    }
    setSelectedRooms([]);
  };

  const clearSelection = () => {
    setSelectedRooms([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="bulk-mode"
            checked={bulkMode}
            onCheckedChange={handleBulkModeToggle}
          />
          <label htmlFor="bulk-mode" className="text-sm font-medium">
            Bulk Actions
          </label>
        </div>

        {bulkMode && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setBulkMode(false)}
          >
            Exit Bulk Mode
          </Button>
        )}
      </div>

      {bulkMode && selectedRooms.length > 0 && (
        <BulkRoomActions
          selectedRooms={selectedRooms}
          onRoomsUpdated={handleRoomsUpdated}
          onClearSelection={clearSelection}
        />
      )}

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
              onStatusUpdate={onStatusUpdate}
              selectable={bulkMode}
              selectedRooms={selectedRooms}
              onSelectionChange={handleSelectionChange}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RoomStatusTabs;
