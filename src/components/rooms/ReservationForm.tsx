
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange, Reservation } from "@/types";
import { isDateReserved } from "@/utils/reservationUtils";

interface ReservationFormProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  guestName: string;
  setGuestName: (name: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  guestPhone: string;
  setGuestPhone: (phone: string) => void;
  adults: number;
  setAdults: (count: number) => void;
  children: number;
  setChildren: (count: number) => void;
  isEditMode: boolean;
  roomNumber: string;
  allReservations: Reservation[];
  excludeReservationId?: string;
}

const ReservationForm = ({
  dateRange,
  setDateRange,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  adults,
  setAdults,
  children,
  setChildren,
  isEditMode,
  roomNumber,
  allReservations,
  excludeReservationId
}: ReservationFormProps) => {
  // Filter reservations for this room only, excluding the current reservation if in edit mode
  const roomReservations = allReservations.filter(
    res => res.roomNumber === roomNumber && res.id !== excludeReservationId
  );

  return (
    <div className="space-y-4 mt-4">
      <div>
        <p className="text-sm font-medium mb-2">Select Dates</p>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) => {
            if (range) {
              setDateRange({
                from: range.from,
                to: range.to,
              });
            }
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateValue = new Date(date);
            dateValue.setHours(0, 0, 0, 0);
            return dateValue < today || isDateReserved(date, roomNumber, roomReservations);
          }}
          modifiers={{
            available: (date) => !isDateReserved(date, roomNumber, roomReservations),
            reserved: (date) => isDateReserved(date, roomNumber, roomReservations)
          }}
          modifiersStyles={{
            available: { backgroundColor: "rgba(34, 197, 94, 0.1)" },
            reserved: { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }
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
        </div>
      )}

      <div className="space-y-4 mt-6">
        <div className="grid gap-2">
          <Label htmlFor="guestName">Guest Name *</Label>
          <Input
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Full name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="guestEmail">Email</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="guestPhone">Phone</Label>
            <Input
              id="guestPhone"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="Phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="adults">Adults *</Label>
            <Select
              value={adults.toString()}
              onValueChange={(value) => setAdults(parseInt(value))}
            >
              <SelectTrigger id="adults">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="children">Children</Label>
            <Select
              value={children.toString()}
              onValueChange={(value) => setChildren(parseInt(value))}
            >
              <SelectTrigger id="children">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
