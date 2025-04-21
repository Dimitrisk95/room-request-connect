
import { useState } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockReservations, mockRooms } from "@/data/mockData";
import { Reservation } from "@/types";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import { CalendarPlus } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "list">("day");
  const [showAddReservation, setShowAddReservation] = useState(false);
  
  // Format the selected date to ISO format for comparison
  const formattedDate = date ? date.toISOString().split('T')[0] : "";

  // Filter reservations for the selected date
  const getDayReservations = () => {
    return mockReservations.filter(reservation => {
      const checkIn = reservation.checkIn;
      const checkOut = reservation.checkOut;
      return (
        (formattedDate >= checkIn && formattedDate <= checkOut) ||
        formattedDate === checkIn ||
        formattedDate === checkOut
      );
    });
  };

  // Group reservations by room
  const groupReservationsByRoom = (reservations: Reservation[]) => {
    return reservations.reduce((acc, reservation) => {
      acc[reservation.roomNumber] = acc[reservation.roomNumber] || [];
      acc[reservation.roomNumber].push(reservation);
      return acc;
    }, {} as Record<string, Reservation[]>);
  };

  // Get room data
  const getRoomData = (roomNumber: string) => {
    return mockRooms.find(room => room.roomNumber === roomNumber);
  };

  // Get check-in and check-out counts for date decoration
  const getReservationsForDate = (dateString: string) => {
    const checkIns = mockReservations.filter(r => r.checkIn === dateString);
    const checkOuts = mockReservations.filter(r => r.checkOut === dateString);
    return { checkIns, checkOuts };
  };

  // Day's reservations
  const dayReservations = getDayReservations();
  const roomReservations = groupReservationsByRoom(dayReservations);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Reservation Calendar</h1>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={() => setShowAddReservation(true)}
              className="flex items-center gap-1"
            >
              <CalendarPlus className="h-4 w-4" />
              Add Reservation
            </Button>
            <Button variant={viewMode === "day" ? "default" : "outline"} onClick={() => setViewMode("day")}>
              Day View
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
              List View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar component */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  checkIn: (date) => {
                    const dateString = date.toISOString().split('T')[0];
                    return getReservationsForDate(dateString).checkIns.length > 0;
                  },
                  checkOut: (date) => {
                    const dateString = date.toISOString().split('T')[0];
                    return getReservationsForDate(dateString).checkOuts.length > 0;
                  },
                }}
                modifiersStyles={{
                  checkIn: {
                    backgroundColor: "rgba(var(--color-primary), 0.1)",
                    borderBottom: "3px solid rgb(var(--color-primary))",
                  },
                  checkOut: {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderTop: "3px solid rgb(59, 130, 246)",
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Reservations for selected date */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {date && (
                  <span>
                    Reservations for {date.toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dayReservations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No reservations for this date
                </div>
              ) : viewMode === "day" ? (
                <div className="space-y-6">
                  {Object.entries(roomReservations).map(([roomNumber, reservations]) => {
                    const room = getRoomData(roomNumber);
                    return (
                      <div key={roomNumber} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-medium">Room {roomNumber}</h3>
                            <p className="text-sm text-muted-foreground">{room?.type || "Standard"} Room</p>
                          </div>
                          <Badge variant={room?.status === "occupied" ? "default" : "outline"}>
                            {room?.status || "vacant"}
                          </Badge>
                        </div>
                        
                        {reservations.map(reservation => {
                          const isCheckIn = reservation.checkIn === formattedDate;
                          const isCheckOut = reservation.checkOut === formattedDate;
                          
                          return (
                            <div key={reservation.id} className="border-t pt-4 mt-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">{reservation.guestName}</h4>
                                  <p className="text-sm">
                                    {reservation.adults + reservation.children} Guests • 
                                    ${reservation.totalAmount}
                                  </p>
                                  <div className="flex gap-2 mt-2">
                                    {isCheckIn && (
                                      <Badge variant="outline" className="bg-primary/10 text-primary">
                                        Check-in today
                                      </Badge>
                                    )}
                                    {isCheckOut && (
                                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                        Check-out today
                                      </Badge>
                                    )}
                                    {!isCheckIn && !isCheckOut && (
                                      <Badge variant="outline">
                                        Staying
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">
                                    {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 mt-4">
                                <Button size="sm" variant="outline">View Details</Button>
                                {isCheckIn && <Button size="sm">Check In</Button>}
                                {isCheckOut && <Button size="sm">Check Out</Button>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {dayReservations.map(reservation => (
                    <div key={reservation.id} className="flex items-center border rounded-lg p-4">
                      <div className="font-medium text-lg mr-3">
                        {reservation.roomNumber}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{reservation.guestName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="hidden md:block text-right mr-4">
                        <div className="font-medium">${reservation.totalAmount}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.status}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddReservationDialog 
        open={showAddReservation} 
        onOpenChange={setShowAddReservation}
      />
    </DashboardShell>
  );
};

export default Calendar;
