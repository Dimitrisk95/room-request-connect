
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TabsContent } from "@/components/ui/tabs";
import { calculateNights } from "@/utils/reservationUtils";
import { DateRange } from "@/types";

interface Props {
  dateRange: DateRange;
  onCalendarSelect: (range: { from?: Date; to?: Date } | undefined) => void;
}

export default function ReservationDatesStep({ dateRange, onCalendarSelect }: Props) {
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
            disabled={(date) => date < new Date()}
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
