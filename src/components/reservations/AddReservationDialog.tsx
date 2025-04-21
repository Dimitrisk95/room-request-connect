
import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockRooms, mockReservations } from "@/data/mockData";
import { DateRange } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { isRoomAvailable, formatDateToString } from "@/utils/reservationUtils";
import ReservationDatesStep from "./ReservationDatesStep";
import ReservationRoomStep from "./ReservationRoomStep";
import ReservationGuestStep from "./ReservationGuestStep";

interface AddReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReservationDialog({ open, onOpenChange }: AddReservationDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dates");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  // Filter available rooms based on the selected date range
  const availableRooms = mockRooms.filter((room) =>
    isRoomAvailable(room, dateRange, mockReservations)
  );

  const handleSubmit = () => {
    if (!dateRange.from || !dateRange.to || !selectedRoom || !guestName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Reservation created",
      description: `Successfully booked Room ${selectedRoom} for ${guestName} from ${format(dateRange.from, "PP")} to ${format(dateRange.to, "PP")}`,
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedRoom("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setAdults(1);
    setChildren(0);
    setActiveTab("dates");
  };

  const handleRoomSelect = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    if (roomNumber) {
      // Automatically move to the next tab when a room is selected
      setActiveTab("guest");
    }
  };

  const handleCalendarSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      setDateRange({
        from: range.from,
        to: range.to,
      });
      
      // If both dates are selected, automatically move to the room tab
      if (range.from && range.to) {
        setActiveTab("room");
      }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
          <DialogDescription>
            Create a new reservation by selecting dates, room, and guest information.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="dates">1. Select Dates</TabsTrigger>
            <TabsTrigger value="room" disabled={!dateRange.from || !dateRange.to}>
              2. Choose Room
            </TabsTrigger>
            <TabsTrigger value="guest" disabled={!selectedRoom}>
              3. Guest Info
            </TabsTrigger>
          </TabsList>
          <ReservationDatesStep
            dateRange={dateRange}
            onCalendarSelect={handleCalendarSelect}
          />
          <ReservationRoomStep
            availableRooms={availableRooms}
            selectedRoom={selectedRoom}
            onRoomSelect={handleRoomSelect}
          />
          <ReservationGuestStep
            guestName={guestName}
            setGuestName={setGuestName}
            guestEmail={guestEmail}
            setGuestEmail={setGuestEmail}
            guestPhone={guestPhone}
            setGuestPhone={setGuestPhone}
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
          />
        </Tabs>
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!guestName || !selectedRoom || !dateRange.from || !dateRange.to}
          >
            Create Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
