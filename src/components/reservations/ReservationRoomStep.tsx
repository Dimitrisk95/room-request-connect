
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Room } from "@/types";

interface Props {
  availableRooms: Room[];
  selectedRoom: string;
  onRoomSelect: (roomNumber: string) => void;
}

const mockRooms = availableRooms => availableRooms;

export default function ReservationRoomStep({
  availableRooms,
  selectedRoom,
  onRoomSelect,
}: Props) {
  return (
    <TabsContent value="room" className="mt-4">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select an available room for the selected dates
        </p>
        {availableRooms.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground">
              No rooms available for the selected dates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableRooms.map((room) => (
              <div
                key={room.id}
                className={cn(
                  "border rounded-md p-3 cursor-pointer hover:border-primary transition-colors",
                  selectedRoom === room.roomNumber &&
                    "border-primary bg-primary/5"
                )}
                onClick={() => onRoomSelect(room.roomNumber)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Room {room.roomNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {room.type} • Floor {room.floor}
                    </p>
                  </div>
                  <Badge variant="outline">{room.status}</Badge>
                </div>
                <p className="text-sm mt-2">Capacity: {room.capacity}</p>
              </div>
            ))}
          </div>
        )}
        {selectedRoom && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <p>
              <strong>Selected Room:</strong> {selectedRoom}
            </p>
            <p>
              <strong>Type:</strong>{" "}
              {
                availableRooms.find((r) => r.roomNumber === selectedRoom)?.type
              }
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
