
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface Props {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  getReservationsForDate: (dateString: string) => { checkIns: any[]; checkOuts: any[] };
  viewMode: "day" | "list";
  setViewMode: (mode: "day" | "list") => void;
  openAddReservation: () => void;
}

const CalendarSidebar = ({
  date,
  onDateChange,
  getReservationsForDate,
  viewMode,
  setViewMode,
  openAddReservation,
}: Props) => (
  <Card className="lg:col-span-1">
    <CardHeader>
      <CardTitle>Select Date</CardTitle>
    </CardHeader>
    <CardContent>
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={onDateChange}
        className="rounded-md border pointer-events-auto"
        modifiers={{
          checkIn: (date) => {
            const dateString = date.toISOString().split("T")[0];
            return getReservationsForDate(dateString).checkIns.length > 0;
          },
          checkOut: (date) => {
            const dateString = date.toISOString().split("T")[0];
            return getReservationsForDate(dateString).checkOuts.length > 0;
          },
          reserved: (date) => {
            const dateString = date.toISOString().split("T")[0];
            return (
              getReservationsForDate(dateString).checkIns.length > 0 ||
              getReservationsForDate(dateString).checkOuts.length > 0
            );
          }
        }}
        modifiersStyles={{
          checkIn: {
            backgroundColor: "rgba(var(--color-primary), 0.1)",
            borderBottom: "3px solid rgb(var(--color-primary))",
          },
          checkOut: {
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderTop: "3px solid rgb(59, 130, 246)",
          },
          reserved: {
            color: "#ef4444",
          }
        }}
      />
      <div className="flex gap-2 mt-4">
        <Button variant="default" onClick={openAddReservation} className="flex items-center gap-1">
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
    </CardContent>
  </Card>
);

export default CalendarSidebar;
