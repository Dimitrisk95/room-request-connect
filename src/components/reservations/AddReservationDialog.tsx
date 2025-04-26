
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockRooms } from "@/data/mockData";
import { Reservation } from "@/types";
import { isRoomAvailable } from "@/utils/reservationUtils";
import ReservationDatesStep from "./ReservationDatesStep";
import ReservationRoomStep from "./ReservationRoomStep";
import ReservationGuestStep from "./ReservationGuestStep";
import { useReservationForm } from "@/hooks/useReservationForm";

interface AddReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReservationAdded?: (reservation: Reservation) => void;
}

export function AddReservationDialog({ 
  open, 
  onOpenChange, 
  onReservationAdded 
}: AddReservationDialogProps) {
  const {
    activeTab,
    setActiveTab,
    dateRange,
    selectedRoom,
    guestName,
    guestEmail,
    guestPhone,
    adults,
    children,
    handleSubmit,
    handleRoomSelect,
    handleCalendarSelect,
    setGuestName,
    setGuestEmail,
    setGuestPhone,
    setAdults,
    setChildren,
  } = useReservationForm(onReservationAdded, onOpenChange);

  const availableRooms = mockRooms.filter((room) =>
    isRoomAvailable(room, dateRange, [])
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
          <DialogDescription>
            Create a new reservation by selecting dates, room, and guest information.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
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
