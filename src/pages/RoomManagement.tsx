import { useState, useEffect } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockRooms, mockReservations } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Room, Reservation } from "@/types";
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import { useToast } from "@/hooks/use-toast";
import RoomsGrid from "@/components/rooms/RoomsGrid";

const RoomManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomsData, setRoomsData] = useState(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [showAddReservation, setShowAddReservation] = useState(false);

  const filterRooms = (rooms: Room[], floor: number | null = null) => {
    return rooms.filter((room) => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            room.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFloor = floor === null || room.floor === floor;
      return matchesSearch && matchesFloor;
    });
  };

  const floorGroups = roomsData.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(floorGroups).map(Number).sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-pending text-pending-foreground";
      case "vacant":
        return "bg-success text-success-foreground";
      case "maintenance":
        return "bg-destructive text-destructive-foreground";
      case "cleaning":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
  };

  const handleReservationAdded = (newReservation: Reservation) => {
    setReservations(prev => {
      const exists = prev.findIndex(r => r.id === newReservation.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = newReservation;
        return updated;
      }
      return [...prev, newReservation];
    });

    updateRoomStatus(newReservation.roomNumber, "occupied");
  };

  const updateRoomStatus = (roomNumber: string, status: "vacant" | "occupied" | "maintenance" | "cleaning") => {
    setRoomsData(prev => 
      prev.map(room => 
        room.roomNumber === roomNumber ? { ...room, status } : room
      )
    );
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Room Management</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-[220px]"
            />
            <Button onClick={() => setShowAddReservation(true)}>Add Reservation</Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="vacant">Vacant</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {floors.map((floor) => (
              <Card key={floor}>
                <CardHeader>
                  <CardTitle>Floor {floor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RoomsGrid
                    rooms={filterRooms(floorGroups[floor])}
                    getStatusColor={getStatusColor}
                    onRoomClick={handleRoomClick}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="occupied" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupied Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <RoomsGrid
                  rooms={filterRooms(roomsData.filter((r) => r.status === "occupied"))}
                  getStatusColor={getStatusColor}
                  onRoomClick={handleRoomClick}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vacant Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <RoomsGrid
                  rooms={filterRooms(roomsData.filter((r) => r.status === "vacant"))}
                  getStatusColor={getStatusColor}
                  onRoomClick={handleRoomClick}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance & Cleaning</CardTitle>
              </CardHeader>
              <CardContent>
                <RoomsGrid
                  rooms={filterRooms(
                    roomsData.filter((r) =>
                      ["maintenance", "cleaning"].includes(r.status)
                    )
                  )}
                  getStatusColor={getStatusColor}
                  onRoomClick={handleRoomClick}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RoomDetailsDialog
        open={roomDetailsOpen}
        onOpenChange={setRoomDetailsOpen}
        room={selectedRoom}
        reservations={reservations}
        onReservationAdded={handleReservationAdded}
        onReservationUpdated={handleReservationAdded}
      />

      <AddReservationDialog
        open={showAddReservation}
        onOpenChange={setShowAddReservation}
        onReservationAdded={handleReservationAdded}
      />
    </DashboardShell>
  );
};

export default RoomManagement;
