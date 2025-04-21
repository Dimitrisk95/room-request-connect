
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

const RoomManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomsData, setRoomsData] = useState(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [showAddReservation, setShowAddReservation] = useState(false);

  // Filter rooms by search term and floor
  const filterRooms = (rooms: Room[], floor: number | null = null) => {
    return rooms.filter((room) => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            room.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFloor = floor === null || room.floor === floor;
      return matchesSearch && matchesFloor;
    });
  };

  // Group rooms by floor
  const floorGroups = roomsData.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(floorGroups).map(Number).sort();

  // Get status badge color
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

  // Handle room click and show dialog
  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
  };

  // Handle adding a new reservation
  const handleReservationAdded = (newReservation: Reservation) => {
    setReservations(prev => {
      // Check if this reservation already exists (for updates)
      const exists = prev.findIndex(r => r.id === newReservation.id);
      if (exists >= 0) {
        // Replace the existing reservation
        const updated = [...prev];
        updated[exists] = newReservation;
        return updated;
      }
      // Add new reservation
      return [...prev, newReservation];
    });

    // Update room status if needed
    updateRoomStatus(newReservation.roomNumber, "occupied");
  };

  // Update room status
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filterRooms(floorGroups[floor]).map((room) => (
                      <div
                        key={room.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          room.status === "occupied" ? "border-pending" : 
                          room.status === "maintenance" ? "border-destructive" : 
                          room.status === "cleaning" ? "border-warning" : 
                          "border-success"
                        }`}
                        onClick={() => handleRoomClick(room)}
                      >
                        <div className="font-medium">Room {room.roomNumber}</div>
                        <div className="text-xs text-muted-foreground">{room.type}</div>
                        <Badge variant="outline" className={`mt-2 ${getStatusColor(room.status)}`}>
                          {room.status}
                        </Badge>
                        {room.currentGuest && (
                          <div className="mt-2 text-xs truncate">
                            {room.currentGuest.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filterRooms(roomsData.filter(r => r.status === "occupied")).map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg border border-pending cursor-pointer transition-all hover:shadow-md"
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="font-medium">Room {room.roomNumber}</div>
                      <div className="text-xs text-muted-foreground">{room.type}</div>
                      <Badge variant="outline" className={`mt-2 ${getStatusColor(room.status)}`}>
                        {room.status}
                      </Badge>
                      {room.currentGuest && (
                        <div className="mt-2 text-xs truncate">
                          {room.currentGuest.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vacant Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filterRooms(roomsData.filter(r => r.status === "vacant")).map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg border border-success cursor-pointer transition-all hover:shadow-md"
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="font-medium">Room {room.roomNumber}</div>
                      <div className="text-xs text-muted-foreground">{room.type}</div>
                      <Badge variant="outline" className={`mt-2 ${getStatusColor(room.status)}`}>
                        {room.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance & Cleaning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filterRooms(roomsData.filter(r => ["maintenance", "cleaning"].includes(r.status))).map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        room.status === "maintenance" ? "border-destructive" : "border-warning"
                      }`}
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="font-medium">Room {room.roomNumber}</div>
                      <div className="text-xs text-muted-foreground">{room.type}</div>
                      <Badge variant="outline" className={`mt-2 ${getStatusColor(room.status)}`}>
                        {room.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Room Details Dialog */}
      <RoomDetailsDialog
        open={roomDetailsOpen}
        onOpenChange={setRoomDetailsOpen}
        room={selectedRoom}
        reservations={reservations}
        onReservationAdded={handleReservationAdded}
        onReservationUpdated={handleReservationAdded}
      />

      {/* Add Reservation Dialog */}
      <AddReservationDialog
        open={showAddReservation}
        onOpenChange={setShowAddReservation}
        onReservationAdded={handleReservationAdded}
      />
    </DashboardShell>
  );
};

export default RoomManagement;
