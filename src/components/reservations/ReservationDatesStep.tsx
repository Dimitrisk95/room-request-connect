
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TabsContent } from "@/components/ui/tabs";
import { calculateNights, isDateReserved } from "@/utils/reservationUtils";
import { DateRange, Reservation } from "@/types";

interface Props {
  dateRange: DateRange;
  onCalendarSelect: (range: { from?: Date; to?: Date } | undefined) => void;
  roomNumber?: string;
  allReservations?: Reservation[];
  excludeReservationId?: string;
}

export default function ReservationDatesStep({ 
  dateRange, 
  onCalendarSelect, 
  roomNumber,
  allReservations = [],
  excludeReservationId
}: Props) {
  // Create today's date at 00:00:00 to ensure proper comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter reservations for this room, excluding the current reservation being edited if any
  const roomReservations = allReservations.filter(
    (res) => res.roomNumber === roomNumber && res.id !== excludeReservationId
  );

  return (
    <TabsContent value="dates" className="mt-4">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select check-in and check-out dates for the reservation
        </p>
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={onCalendarSelect}
            numberOfMonths={2}
            disabled={(date) => {
              // Allow today by comparing dates at start of day
              const dateValue = new Date(date);
              dateValue.setHours(0, 0, 0, 0);
              
              // First check if date is in the past
              if (dateValue < today) return true;
              
              // If we have a room number and there are reservations, check if date is already reserved
              if (roomNumber && roomReservations.length > 0) {
                return isDateReserved(date, roomNumber, roomReservations);
              }
              
              return false;
            }}
            modifiers={{
              reserved: (date) => roomNumber ? isDateReserved(date, roomNumber, roomReservations) : false,
              available: (date) => {
                if (!roomNumber) return false;
                const dateValue = new Date(date);
                dateValue.setHours(0, 0, 0, 0);
                return dateValue >= today && !isDateReserved(date, roomNumber, roomReservations);
              }
            }}
            modifiersStyles={{
              reserved: {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                textDecoration: "line-through"
              },
              available: {
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                color: "#166534"
              }
            }}
            className="rounded-md border pointer-events-auto"
          />
        </div>
        {dateRange.from && dateRange.to && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <p>
              <strong>Check-in:</strong> {format(dateRange.from, "PPP")}
            </p>
            <p>
              <strong>Check-out:</strong> {format(dateRange.to, "PPP")}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {calculateNights(dateRange.from, dateRange.to)} nights
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
