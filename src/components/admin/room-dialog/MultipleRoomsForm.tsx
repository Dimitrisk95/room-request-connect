
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import type { Room } from "@/types";

interface MultipleRoomsFormProps {
  onSubmit: (roomsData: {
    roomNumbers: string;
    commonFields: Partial<Room>;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const MultipleRoomsForm = ({ onSubmit, isSubmitting }: MultipleRoomsFormProps) => {
  const [multipleRooms, setMultipleRooms] = useState<{
    roomNumbers: string;
    floor: number;
    type: string;
    bedType: Room["bedType"];
    status: Room["status"];
    capacity: number;
  }>({
    roomNumbers: "",
    floor: 1,
    type: "standard",
    bedType: "single",
    status: "vacant",
    capacity: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { roomNumbers, ...commonFields } = multipleRooms;
    await onSubmit({ roomNumbers, commonFields });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="roomNumbers">Room Numbers <span className="text-red-500">*</span></Label>
          <Textarea
            id="roomNumbers"
            value={multipleRooms.roomNumbers}
            onChange={(e) => setMultipleRooms({ ...multipleRooms, roomNumbers: e.target.value })}
            placeholder="Enter room numbers separated by commas or spaces (e.g. 101, 102, 103)"
            required
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">Enter room numbers separated by commas, spaces, or line breaks</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="multiFloor">Floor</Label>
            <Input
              id="multiFloor"
              type="number"
              min="1"
              value={multipleRooms.floor}
              onChange={(e) => setMultipleRooms({ ...multipleRooms, floor: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiCapacity">Max Occupancy</Label>
            <Input
              id="multiCapacity"
              type="number"
              min="1"
              value={multipleRooms.capacity}
              onChange={(e) => setMultipleRooms({ ...multipleRooms, capacity: parseInt(e.target.value) })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="multiType">Room Type</Label>
            <select
              id="multiType"
              className="w-full p-2 border rounded-md bg-background"
              value={multipleRooms.type}
              onChange={(e) => setMultipleRooms({ ...multipleRooms, type: e.target.value })}
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="executive">Executive</option>
              <option value="family">Family</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiBedType">Bed Type</Label>
            <select
              id="multiBedType"
              className="w-full p-2 border rounded-md bg-background"
              value={multipleRooms.bedType}
              onChange={(e) => {
                const bedType = e.target.value as Room["bedType"];
                setMultipleRooms({ ...multipleRooms, bedType });
              }}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="queen">Queen</option>
              <option value="king">King</option>
              <option value="twin">Twin</option>
              <option value="suite">Suite</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="multiStatus">Status</Label>
          <select
            id="multiStatus"
            className="w-full p-2 border rounded-md bg-background"
            value={multipleRooms.status}
            onChange={(e) => {
              const status = e.target.value as Room["status"];
              setMultipleRooms({ ...multipleRooms, status });
            }}
          >
            <option value="vacant">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Rooms..." : "Add Multiple Rooms"}
        </Button>
      </DialogFooter>
    </form>
  );
};
