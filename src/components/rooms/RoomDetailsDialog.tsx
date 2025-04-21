import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Reservation, Room } from "@/types";
import { useToast } from "@/hooks/use-toast";
import RoomDetailsInfo from "./RoomDetailsInfo";
import RoomReservationsList from "./RoomReservationsList";
import ReservationForm from "./ReservationForm";
import { DateRange } from "@/types";
import { formatDateToString } from "@/utils/reservationUtils";

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
  const [activeTab, setActiveTab] = useState<string>("details");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Filter reservations for this room
  const roomReservations = room ? reservations.filter(
    (res) => res.roomNumber === room?.roomNumber
  ) : [];

  // Reset form when dialog opens/closes or room changes
  useEffect(() => {
    if (open && room) {
      setActiveTab("details");
      setDateRange({ from: undefined, to: undefined });
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setAdults(1);
      setChildren(0);
      setSelectedReservation(null);
      setIsEditMode(false);
    }
  }, [open, room]);

  const handleReservationSelect = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setGuestName(reservation.guestName);
    setAdults(reservation.adults);
    setChildren(reservation.children);
    
    // Extract email and phone from notes if available
    if (reservation.notes) {
      const emailMatch = reservation.notes.match(/Email: ([^,]+)/);
      const phoneMatch = reservation.notes.match(/Phone: ([^,]+)/);
      
      setGuestEmail(emailMatch ? emailMatch[1] : "");
      setGuestPhone(phoneMatch ? phoneMatch[1] : "");
    }
    
    setDateRange({
      from: new Date(reservation.checkIn),
      to: new Date(reservation.checkOut)
    });
    
    setIsEditMode(true);
    setActiveTab("reservation");
  };

  const handleCreateReservation = () => {
    if (!room || !dateRange.from || !dateRange.to || !guestName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create a new reservation
    const newReservation: Reservation = {
      id: isEditMode && selectedReservation ? selectedReservation.id : `res-${Date.now()}`,
      roomId: `room-${room.roomNumber}`,
      roomNumber: room.roomNumber,
      guestId: isEditMode && selectedReservation ? selectedReservation.guestId : `guest-${Date.now()}`,
      guestName: guestName,
      checkIn: formatDateToString(dateRange.from),
      checkOut: formatDateToString(dateRange.to),
      status: "confirmed",
      adults: adults,
      children: children,
      totalAmount: isEditMode && selectedReservation ? selectedReservation.totalAmount : Math.floor(Math.random() * 1000) + 100,
      paidAmount: isEditMode && selectedReservation ? selectedReservation.paidAmount : 0,
      notes: guestEmail || guestPhone ? `Email: ${guestEmail}, Phone: ${guestPhone}` : undefined
    };

    if (isEditMode && onReservationUpdated) {
      onReservationUpdated(newReservation);
      toast({
        title: "Reservation updated",
        description: `Successfully updated reservation for Room ${room.roomNumber}`,
      });
    } else if (onReservationAdded) {
      onReservationAdded(newReservation);
      toast({
        title: "Reservation created",
        description: `Successfully booked Room ${room.roomNumber} for ${guestName}`,
      });
    }
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDateRange({ from: undefined, to: undefined });
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setAdults(1);
    setChildren(0);
    setSelectedReservation(null);
    setIsEditMode(false);
  };

  const handleNewReservation = () => {
    setIsEditMode(false);
    setSelectedReservation(null);
    resetForm();
    setActiveTab("reservation");
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Room {room.roomNumber} - {room.type}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details">Room Details</TabsTrigger>
            <TabsTrigger value="reservation">
              {isEditMode ? "Edit Reservation" : "New Reservation"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <RoomDetailsInfo room={room} />
            <RoomReservationsList
              reservations={roomReservations}
              onReservationSelect={handleReservationSelect}
              onNewReservation={handleNewReservation}
            />
          </TabsContent>
          
          <TabsContent value="reservation" className="space-y-4">
            <ReservationForm
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
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "reservation" && (
            <Button 
              onClick={handleCreateReservation}
              disabled={!dateRange.from || !dateRange.to || !guestName}
            >
              {isEditMode ? "Update Reservation" : "Create Reservation"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoomDetailsDialog;
