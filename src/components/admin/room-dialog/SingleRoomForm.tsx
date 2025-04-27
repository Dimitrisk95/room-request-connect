
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Room } from "@/types";
import { DialogFooter } from "@/components/ui/dialog";

interface SingleRoomFormProps {
  onSubmit: (roomData: Partial<Room>) => Promise<void>;
  editingRoom?: Room | null;
  isSubmitting: boolean;
}

export const SingleRoomForm = ({ onSubmit, editingRoom, isSubmitting }: SingleRoomFormProps) => {
  const [room, setRoom] = useState({
    roomNumber: "",
    floor: 1,
    type: "standard",
    bedType: "single" as const,
    status: "vacant" as const,
    capacity: 2,
  });

  useEffect(() => {
    if (editingRoom) {
      setRoom({
        roomNumber: editingRoom.roomNumber,
        floor: editingRoom.floor,
        type: editingRoom.type,
        bedType: editingRoom.bedType || "single",
        status: editingRoom.status,
        capacity: editingRoom.capacity,
      });
    }
  }, [editingRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(room);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number <span className="text-red-500">*</span></Label>
          <Input
            id="roomNumber"
            value={room.roomNumber}
            onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })}
            placeholder="e.g., 101"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              min="1"
              value={room.floor}
              onChange={(e) => setRoom({ ...room, floor: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Max Occupancy</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={room.capacity}
              onChange={(e) => setRoom({ ...room, capacity: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Room Type</Label>
            <select
              id="type"
              className="w-full p-2 border rounded-md bg-background"
              value={room.type}
              onChange={(e) => setRoom({ ...room, type: e.target.value })}
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="executive">Executive</option>
              <option value="family">Family</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedType">Bed Type</Label>
            <select
              id="bedType"
              className="w-full p-2 border rounded-md bg-background"
              value={room.bedType}
              onChange={(e) => setRoom({ ...room, bedType: e.target.value as Room["bedType"] })}
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
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="w-full p-2 border rounded-md bg-background"
            value={room.status}
            onChange={(e) => setRoom({ ...room, status: e.target.value as Room["status"] })}
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
          {isSubmitting ? (editingRoom ? "Updating..." : "Adding...") : (editingRoom ? "Update Room" : "Add Room")}
        </Button>
      </DialogFooter>
    </form>
  );
};
