
import { useState } from "react";
import { DateRange, Reservation } from "@/types";
import { formatDateToString } from "@/utils/reservationUtils";
import { useToast } from "@/hooks/use-toast";

export const useReservationForm = (
  onReservationAdded?: (reservation: Reservation) => void,
  onOpenChange?: (open: boolean) => void
) => {
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

  const handleSubmit = () => {
    if (!dateRange.from || !dateRange.to || !selectedRoom || !guestName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      roomId: `room-${selectedRoom}`,
      roomNumber: selectedRoom,
      guestId: `guest-${Date.now()}`,
      guestName: guestName,
      checkIn: formatDateToString(dateRange.from),
      checkOut: formatDateToString(dateRange.to),
      status: "confirmed",
      adults: adults,
      children: children,
      totalAmount: Math.floor(Math.random() * 1000) + 100,
      paidAmount: 0,
      notes: guestEmail || guestPhone ? `Email: ${guestEmail}, Phone: ${guestPhone}` : undefined
    };

    if (onReservationAdded) {
      onReservationAdded(newReservation);
    }

    toast({
      title: "Reservation created",
      description: `Successfully booked Room ${selectedRoom} for ${guestName}`,
    });
    
    resetForm();
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleRoomSelect = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    if (roomNumber) {
      setActiveTab("guest");
    }
  };

  const handleCalendarSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      setDateRange({
        from: range.from,
        to: range.to,
      });
      
      if (range.from && range.to) {
        setActiveTab("room");
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    dateRange,
    setDateRange,
    selectedRoom,
    setSelectedRoom,
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
    handleSubmit,
    handleRoomSelect,
    handleCalendarSelect,
    resetForm,
  };
};
