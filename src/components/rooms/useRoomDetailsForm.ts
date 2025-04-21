
import { useState, useEffect } from "react";
import { DateRange, Reservation, Room } from "@/types";
import { formatDateToString } from "@/utils/reservationUtils";

export const useRoomDetailsForm = (
  open: boolean,
  room: Room | null,
  reservations: Reservation[],
  toast: any,
  onReservationAdded?: (reservation: Reservation) => void,
  onReservationUpdated?: (reservation: Reservation) => void,
  onReservationDeleted?: (reservationId: string) => void,
  onOpenChange?: (open: boolean) => void
) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const roomReservations = room ? reservations.filter(
    (res) => res.roomNumber === room?.roomNumber
  ) : [];

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
    if (reservation.notes) {
      const emailMatch = reservation.notes.match(/Email: ([^,]+)/);
      const phoneMatch = reservation.notes.match(/Phone: ([^,]+)/);
      setGuestEmail(emailMatch ? emailMatch[1] : "");
      setGuestPhone(phoneMatch ? phoneMatch[1] : "");
    }
    setDateRange({
      from: new Date(reservation.checkIn),
      to: new Date(reservation.checkOut),
    });
    setIsEditMode(true);
    setActiveTab("reservation");
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

  const handleCreateReservation = () => {
    if (!room || !dateRange.from || !dateRange.to || !guestName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

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
    if (onOpenChange) onOpenChange(false);
  };

  const handleDeleteReservation = () => {
    if (selectedReservation && onReservationDeleted) {
      onReservationDeleted(selectedReservation.id);
      toast({
        title: "Reservation cancelled",
        description: `Reservation for ${selectedReservation.guestName} has been cancelled.`,
      });
      resetForm();
      if (onOpenChange) onOpenChange(false);
    }
  };

  const handleNewReservation = () => {
    setIsEditMode(false);
    setSelectedReservation(null);
    resetForm();
    setActiveTab("reservation");
  };

  return {
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
    selectedReservation,
    handleReservationSelect,
    handleCreateReservation,
    handleDeleteReservation,
    handleNewReservation,
    roomReservations
  };
};
