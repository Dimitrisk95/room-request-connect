
import { Room, Guest, Request, Reservation } from "@/types";

// Generate a random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format date to ISO string
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Generate mock rooms
export const mockRooms: Room[] = Array.from({ length: 20 }, (_, i) => {
  const roomNumber = `${Math.floor(i / 5) + 1}${(i % 5) + 1}${Math.floor(Math.random() * 10)}`;
  const status = Math.random() > 0.6 ? "occupied" : "vacant";
  
  return {
    id: `room-${i + 1}`,
    roomNumber,
    type: ["Standard", "Deluxe", "Suite"][Math.floor(Math.random() * 3)],
    floor: Math.floor(i / 5) + 1,
    capacity: Math.floor(Math.random() * 3) + 1,
    status: status as "vacant" | "occupied" | "maintenance" | "cleaning",
  };
});

// Generate mock guests
export const mockGuests: Guest[] = Array.from({ length: 10 }, (_, i) => {
  const checkIn = formatDate(randomDate(new Date(2023, 3, 1), new Date()));
  const checkOut = formatDate(randomDate(new Date(), new Date(2023, 5, 30)));
  const room = mockRooms[Math.floor(Math.random() * mockRooms.length)];
  
  return {
    id: `guest-${i + 1}`,
    name: ["John Doe", "Jane Smith", "Robert Johnson", "Sarah Williams", "Michael Brown", "Emily Davis", "David Miller", "Lisa Wilson", "James Moore", "Jennifer Taylor"][i],
    email: `guest${i + 1}@example.com`,
    phone: `+1-555-${100 + i}-${1000 + i}`,
    checkIn,
    checkOut,
    roomId: room.id,
    roomNumber: room.roomNumber,
  };
});

// Assign guests to rooms
mockRooms.forEach((room, index) => {
  if (room.status === "occupied" && index < mockGuests.length) {
    room.currentGuest = mockGuests[index];
  }
});

// Request categories
const categories: ("maintenance" | "housekeeping" | "room-service" | "concierge" | "amenities" | "complaint" | "other")[] = [
  "maintenance", "housekeeping", "room-service", "concierge", "amenities", "complaint", "other"
];

// Request titles by category
const requestTitles = {
  maintenance: ["Broken AC", "Leaking faucet", "TV not working", "Flickering lights", "Clogged drain"],
  housekeeping: ["Extra towels needed", "Room cleaning", "Bed sheets change", "Trash removal", "Bathroom supplies"],
  "room-service": ["Breakfast order", "Lunch order", "Dinner order", "Snack request", "Beverage request"],
  concierge: ["Tour booking", "Transportation arrangement", "Restaurant reservation", "Local recommendations", "Event tickets"],
  amenities: ["Extra pillows", "Iron request", "Toiletries request", "Adapter request", "Extra blanket"],
  complaint: ["Noisy neighbors", "Room temperature issue", "Cleanliness issue", "Staff complaint", "Billing issue"],
  other: ["Special request", "Information inquiry", "Lost and found", "Late checkout request", "Wake-up call"]
};

// Generate mock requests
export const mockRequests: Request[] = Array.from({ length: 15 }, (_, i) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const title = requestTitles[category][Math.floor(Math.random() * requestTitles[category].length)];
  const status = ["pending", "in-progress", "resolved", "cancelled"][Math.floor(Math.random() * (i > 10 ? 4 : 3))];
  const priority = ["low", "medium", "high", "urgent"][Math.floor(Math.random() * 4)];
  const guest = mockGuests[Math.floor(Math.random() * mockGuests.length)];
  const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
  const updatedAt = new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000)).toISOString();

  return {
    id: `req-${i + 1}`,
    title,
    description: `${title} in room ${guest.roomNumber}. ${Math.random() > 0.5 ? "Please address as soon as possible." : ""}`,
    roomId: guest.roomId,
    roomNumber: guest.roomNumber,
    guestId: guest.id,
    guestName: guest.name,
    category,
    status: status as "pending" | "in-progress" | "resolved" | "cancelled",
    priority: priority as "low" | "medium" | "high" | "urgent",
    createdAt,
    updatedAt,
    assignedTo: status !== "pending" ? "staff-1" : undefined,
    assignedToName: status !== "pending" ? "Staff Member" : undefined,
    resolvedBy: status === "resolved" ? "staff-1" : undefined,
    resolvedByName: status === "resolved" ? "Staff Member" : undefined,
    resolvedAt: status === "resolved" ? updatedAt : undefined,
    notes: status !== "pending" ? ["Working on this issue", "Parts ordered"] : [],
  };
});

// Generate mock reservations
export const mockReservations: Reservation[] = Array.from({ length: 25 }, (_, i) => {
  const room = mockRooms[Math.floor(Math.random() * mockRooms.length)];
  const checkInDate = randomDate(new Date(2023, 3, 1), new Date(2023, 5, 30));
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
  
  const checkIn = formatDate(checkInDate);
  const checkOut = formatDate(checkOutDate);
  
  const status = checkInDate < new Date() 
    ? (checkOutDate < new Date() ? "checked-out" : "checked-in") 
    : "confirmed";
  
  const adults = Math.floor(Math.random() * 2) + 1;
  const children = Math.floor(Math.random() * 3);
  
  return {
    id: `res-${i + 1}`,
    roomId: room.id,
    roomNumber: room.roomNumber,
    guestId: `guest-${Math.floor(Math.random() * 100) + 10}`,
    guestName: ["Alex Johnson", "Maria Garcia", "Tom Wilson", "Sophia Lee", "Daniel Martin", "Olivia Brown", "Ethan Davis", "Isabella Miller", "Matthew Taylor", "Emma Anderson"][Math.floor(Math.random() * 10)],
    checkIn,
    checkOut,
    status: status as "confirmed" | "checked-in" | "checked-out" | "cancelled",
    adults,
    children,
    totalAmount: ((adults * 100) + (children * 50)) * (Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))),
    paidAmount: Math.random() > 0.3 ? ((adults * 100) + (children * 50)) * (Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 0,
    notes: Math.random() > 0.7 ? "Special requests: Late check-in, extra pillows" : undefined,
  };
});
