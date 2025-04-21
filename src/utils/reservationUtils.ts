
import { Room, Reservation } from "@/types";
import { isAfter, isBefore, isEqual } from "date-fns";

/**
 * Check if a room is available for a specific date range
 */
export const isRoomAvailable = (
  room: Room,
  dateRange: { from: Date | undefined; to: Date | undefined },
  existingReservations: Reservation[]
): boolean => {
  if (!dateRange.from || !dateRange.to) return true;

  // If room is under maintenance or cleaning, it's not available
  if (room.status === "maintenance" || room.status === "cleaning") {
    return false;
  }

  // Check if there's any reservation for this room that overlaps with the selected date range
  const conflictingReservations = existingReservations.filter((reservation) => {
    if (reservation.roomNumber !== room.roomNumber) return false;

    const resCheckIn = new Date(reservation.checkIn);
    const resCheckOut = new Date(reservation.checkOut);

    // Check for overlapping reservations
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
