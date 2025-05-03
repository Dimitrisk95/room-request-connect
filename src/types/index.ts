
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "guest";
  hotelId?: string;
  roomNumber?: string;
  can_manage_rooms?: boolean;
  can_manage_staff?: boolean;
}

// Staff related types
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "guest";
  created_at?: string;
  can_manage_rooms?: boolean;
  can_manage_staff?: boolean;
}

// Room related types
export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  bedType: "single" | "double" | "queen" | "king" | "twin" | "suite";
  status: "vacant" | "occupied" | "maintenance" | "cleaning";
  capacity: number;
  room_code?: string;
  // Removed currentGuest property
}

// Guest related types
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  roomId: string;
  roomNumber: string;
}

// Request status types
export type RequestStatus = "pending" | "in-progress" | "resolved" | "cancelled";

// Request priority types
export type RequestPriority = "low" | "medium" | "high" | "urgent";

// Request category types
export type RequestCategory = 
  | "maintenance" 
  | "housekeeping" 
  | "room-service" 
  | "concierge" 
  | "amenities" 
  | "complaint" 
  | "other";

// Guest request types
export interface Request {
  id: string;
  title: string;
  description: string;
  roomId: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
  category: RequestCategory;
  status: RequestStatus;
  priority: RequestPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  resolvedAt?: string;
  notes?: string[];
}

// Reservation types
export interface Reservation {
  id: string;
  roomId: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
}

// DateRange type for calendar selections
// Modified to make both properties optional to be compatible with react-day-picker
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  hotel_code?: string;
}
