
import { Room, Reservation, DateRange } from "@/types";
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";

/**
 * Check if a room is available for a specific date range
 */
export const isRoomAvailable = (
  room: Room,
  dateRange: DateRange,
  existingReservations: Reservation[],
  excludeReservationId?: string
): boolean => {
  // If no date range is selected, or if it's incomplete, consider the room available
  if (!dateRange.from || !dateRange.to) return true;

  // If room is under maintenance or cleaning, it's not available
  if (room.status === "maintenance" || room.status === "cleaning") {
    return false;
  }

  // Check if there's any reservation for this room that overlaps with the selected date range
  const conflictingReservations = existingReservations.filter((reservation) => {
    // Skip the current reservation if we're in edit mode
    if (excludeReservationId && reservation.id === excludeReservationId) return false;
    
    if (reservation.roomNumber !== room.roomNumber) return false;

    const resCheckIn = new Date(reservation.checkIn);
    const resCheckOut = new Date(reservation.checkOut);

    // Check for overlapping reservations
    // A conflict occurs if:
    // - The new check-in is before the existing check-out AND
    // - The new check-out is after the existing check-in
    return !(
      (isBefore(resCheckOut, dateRange.from) || isEqual(resCheckOut, dateRange.from)) ||
      (isAfter(resCheckIn, dateRange.to) || isEqual(resCheckIn, dateRange.to))
    );
  });

  return conflictingReservations.length === 0;
};

/**
 * Calculate the number of nights between two dates
 */
export const calculateNights = (from: Date, to: Date): number => {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Format a date to a string
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Check if a date is within a reservation
 */
export const isDateReserved = (
  date: Date,
  roomNumber: string,
  reservations: Reservation[]
): boolean => {
  const dateString = formatDateToString(date);
  return reservations.some(
    (res) =>
      res.roomNumber === roomNumber &&
      dateString >= res.checkIn &&
      dateString < res.checkOut // Use < instead of <= for checkout dates
  );
};
