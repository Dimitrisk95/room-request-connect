
import { useState, useEffect } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockReservations, mockRooms } from "@/data/mockData";
import { Reservation } from "@/types";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import CalendarSidebar from "@/components/calendar/CalendarSidebar";
import CalendarDayReservations from "@/components/calendar/CalendarDayReservations";
import CalendarListReservations from "@/components/calendar/CalendarListReservations";
import { useToast } from "@/hooks/use-toast";

// Create a shared state storage to connect Calendar and RoomManagement pages
// In a real application, you would use a state management library or context
// For this demo, we'll use localStorage to simulate shared state
const getStoredReservations = (): Reservation[] => {
  const stored = localStorage.getItem('hotel-reservations');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored reservations", e);
    }
  }
  return mockReservations;
};

const storeReservations = (reservations: Reservation[]) => {
  localStorage.setItem('hotel-reservations', JSON.stringify(reservations));
};

const Calendar = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "list">("day");
  const [showAddReservation, setShowAddReservation] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>(getStoredReservations());

  const formattedDate = date ? date.toISOString().split("T")[0] : "";

  // When reservations change, store them for cross-page access
  useEffect(() => {
    storeReservations(reservations);
  }, [reservations]);

  // Load shared reservations when page loads
  useEffect(() => {
    const storedReservations = getStoredReservations();
    setReservations(storedReservations);

    // Set up storage event listener to detect changes from other pages
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hotel-reservations' && e.newValue) {
        try {
          setReservations(JSON.parse(e.newValue));
        } catch (e) {
          console.error("Failed to parse stored reservations from other page", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshReservations = (newReservation?: Reservation) => {
    if (newReservation) {
      // Check if this is an update or a new reservation
      const existingIndex = reservations.findIndex(r => r.id === newReservation.id);
      if (existingIndex >= 0) {
        // Update existing reservation
        const updatedReservations = [...reservations];
        updatedReservations[existingIndex] = newReservation;
        setReservations(updatedReservations);
      } else {
        // Add new reservation
        setReservations(prev => [...prev, newReservation]);
      }
    }
  };

  const handleDeleteReservation = (reservationId: string) => {
    const updatedReservations = reservations.filter(r => r.id !== reservationId);
    setReservations(updatedReservations);
    toast({
      title: "Reservation cancelled",
      description: "The reservation has been successfully cancelled."
    });
  };

  const getDayReservations = () => {
    return reservations.filter(reservation => {
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
    const checkIns = reservations.filter(r => r.checkIn === dateString);
    const checkOuts = reservations.filter(r => r.checkOut === dateString);
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
                  onDeleteReservation={handleDeleteReservation}
                />
              ) : (
                <CalendarListReservations 
                  reservations={dayReservations} 
                  onDeleteReservation={handleDeleteReservation}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AddReservationDialog
        open={showAddReservation}
        onOpenChange={setShowAddReservation}
        onReservationAdded={refreshReservations}
      />
    </DashboardShell>
  );
};

export default Calendar;
