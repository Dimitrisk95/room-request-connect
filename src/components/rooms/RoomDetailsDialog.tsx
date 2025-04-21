
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Room, Reservation } from "@/types";
import { useToast } from "@/hooks/use-toast";
import RoomDetailsTabs from "./RoomDetailsTabs";
import RoomDetailsFooter from "./RoomDetailsFooter";
import { useRoomDetailsForm } from "./useRoomDetailsForm";

interface RoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  reservations: Reservation[];
  onReservationAdded?: (reservation: Reservation) => void;
  onReservationUpdated?: (reservation: Reservation) => void;
}

export function RoomDetailsDialog({
  open,
  onOpenChange,
  room,
  reservations,
  onReservationAdded,
  onReservationUpdated
}: RoomDetailsDialogProps) {
  const { toast } = useToast();

  const {
    activeTab,
    setActiveTab,
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
    handleReservationSelect,
    handleCreateReservation,
    handleNewReservation,
    roomReservations
  } = useRoomDetailsForm(
    open,
    room,
    reservations,
    toast,
    onReservationAdded,
    onReservationUpdated,
    onOpenChange
  );

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Room {room.roomNumber} - {room.type}</DialogTitle>
        </DialogHeader>

        <RoomDetailsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          room={room}
          roomReservations={roomReservations}
          onReservationSelect={handleReservationSelect}
          onNewReservation={handleNewReservation}
          dateRange={dateRange}
          setDateRange={setDateRange}
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
          isEditMode={isEditMode}
        />

        <RoomDetailsFooter
          onCancel={() => onOpenChange(false)}
          onAction={handleCreateReservation}
          actionDisabled={!dateRange.from || !dateRange.to || !guestName}
          isReservationTab={activeTab === "reservation"}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}

export default RoomDetailsDialog;
