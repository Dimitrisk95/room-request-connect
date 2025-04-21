
import { useState } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockReservations, mockRooms } from "@/data/mockData";
import { Reservation } from "@/types";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import CalendarSidebar from "@/components/calendar/CalendarSidebar";
import CalendarDayReservations from "@/components/calendar/CalendarDayReservations";
import CalendarListReservations from "@/components/calendar/CalendarListReservations";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "list">("day");
  const [showAddReservation, setShowAddReservation] = useState(false);

  const formattedDate = date ? date.toISOString().split("T")[0] : "";

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

  const groupReservationsByRoom = (reservations: Reservation[]) => {
    return reservations.reduce((acc, reservation) => {
      acc[reservation.roomNumber] = acc[reservation.roomNumber] || [];
      acc[reservation.roomNumber].push(reservation);
      return acc;
    }, {} as Record<string, Reservation[]>);
  };

  const getRoomData = (roomNumber: string) => {
    return mockRooms.find(room => room.roomNumber === roomNumber);
  };

  const getReservationsForDate = (dateString: string) => {
    const checkIns = mockReservations.filter(r => r.checkIn === dateString);
    const checkOuts = mockReservations.filter(r => r.checkOut === dateString);
    return { checkIns, checkOuts };
  };

  const dayReservations = getDayReservations();
  const roomReservations = groupReservationsByRoom(dayReservations);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Reservation Calendar</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CalendarSidebar
            date={date}
            onDateChange={setDate}
            getReservationsForDate={getReservationsForDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            openAddReservation={() => setShowAddReservation(true)}
          />
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {date && (
                  <span>
                    Reservations for {date.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
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
                <CalendarDayReservations
                  roomReservations={roomReservations}
                  getRoomData={getRoomData}
                  formattedDate={formattedDate}
                />
              ) : (
                <CalendarListReservations reservations={dayReservations} />
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
