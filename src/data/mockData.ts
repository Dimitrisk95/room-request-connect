
// Import necessary types
import { Room, Guest, Request, RequestStatus, RequestCategory, RequestPriority, Reservation, StaffMember } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create a date with offset days from now
const dateWithOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Generate fake staff members
export const generateStaffMembers = (count: number = 5): StaffMember[] => {
  const roles = ['admin', 'staff', 'staff', 'staff', 'staff'];
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `Staff Member ${i + 1}`,
    email: `staff${i + 1}@example.com`,
    role: roles[i] as 'admin' | 'staff' | 'guest',
    created_at: new Date().toISOString(),
    can_manage_rooms: i < 2, // Only first 2 staff members can manage rooms
    can_manage_staff: i === 0, // Only admin can manage staff
  }));
};

// Generate fake rooms
export const generateRooms = (count: number = 10): Room[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    roomNumber: `${Math.floor(i / 4) + 1}${(i % 4) + 1}${Math.floor(Math.random() * 10)}`,
    type: ['Standard', 'Deluxe', 'Suite', 'Family'][Math.floor(Math.random() * 4)],
    floor: Math.floor(i / 4) + 1,
    capacity: Math.floor(Math.random() * 3) + 1,
    status: ['vacant', 'occupied', 'maintenance', 'cleaning'][Math.floor(Math.random() * 4)] as 'vacant' | 'occupied' | 'maintenance' | 'cleaning',
    bedType: ['single', 'double', 'queen', 'king', 'twin', 'suite'][Math.floor(Math.random() * 6)] as 'single' | 'double' | 'queen' | 'king' | 'twin' | 'suite',
    room_code: `RM${Math.floor(i / 4) + 1}${(i % 4) + 1}${Math.floor(Math.random() * 10)}-${uuidv4().substring(0, 4).toUpperCase()}`
  }));
};

// Generate fake guests
export const generateGuests = (rooms: Room[]): Guest[] => {
  return rooms
    .filter(room => room.status === 'occupied')
    .map((room) => ({
      id: uuidv4(),
      name: `Guest ${room.roomNumber}`,
      email: `guest${room.roomNumber}@example.com`,
      phone: `+1${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
      checkIn: dateWithOffset(-Math.floor(Math.random() * 3)),
      checkOut: dateWithOffset(Math.floor(Math.random() * 5) + 1),
      roomId: room.id,
      roomNumber: room.roomNumber,
    }));
};

// Generate fake requests
export const generateRequests = (guests: Guest[], rooms: Room[]): Request[] => {
  const categories: RequestCategory[] = [
    'maintenance',
    'housekeeping',
    'room-service',
    'concierge',
    'amenities',
    'complaint',
    'other',
  ];
  
  const statuses: RequestStatus[] = [
    'pending',
    'in-progress',
    'resolved',
    'cancelled',
  ];
  
  const priorities: RequestPriority[] = [
    'low',
    'medium',
    'high',
    'urgent',
  ];
  
  return Array.from({ length: Math.floor(guests.length * 1.5) }, (_, i) => {
    const guestIndex = Math.floor(Math.random() * guests.length);
    const guest = guests[guestIndex];
    const room = rooms.find(r => r.id === guest.roomId)!;
    
    return {
      id: uuidv4(),
      title: `Request ${i + 1}`,
      description: `This is a description for request ${i + 1}`,
      roomId: room.id,
      roomNumber: room.roomNumber,
      guestId: guest.id,
      guestName: guest.name,
      category: categories[Math.floor(Math.random() * categories.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: dateWithOffset(-Math.floor(Math.random() * 5)),
      updatedAt: dateWithOffset(-Math.floor(Math.random() * 3)),
      assignedTo: Math.random() > 0.5 ? uuidv4() : undefined,
      assignedToName: Math.random() > 0.5 ? `Staff ${Math.floor(Math.random() * 5) + 1}` : undefined,
      resolvedBy: Math.random() > 0.7 ? uuidv4() : undefined,
      resolvedByName: Math.random() > 0.7 ? `Staff ${Math.floor(Math.random() * 5) + 1}` : undefined,
      resolvedAt: Math.random() > 0.7 ? dateWithOffset(-Math.floor(Math.random() * 2)) : undefined,
      notes: Math.random() > 0.5 ? [`Note 1 for request ${i + 1}`, `Note 2 for request ${i + 1}`] : [],
    };
  });
};

// Generate fake reservations
export const generateReservations = (rooms: Room[]): Reservation[] => {
  return rooms.map((room) => ({
    id: uuidv4(),
    roomId: room.id,
    roomNumber: room.roomNumber,
    guestId: uuidv4(),
    guestName: `Guest for Room ${room.roomNumber}`,
    checkIn: dateWithOffset(Math.floor(Math.random() * 10) + 1),
    checkOut: dateWithOffset(Math.floor(Math.random() * 10) + 5),
    status: ['confirmed', 'checked-in', 'checked-out', 'cancelled'][Math.floor(Math.random() * 4)] as 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled',
    adults: Math.floor(Math.random() * 2) + 1,
    children: Math.floor(Math.random() * 3),
    totalAmount: Math.floor(Math.random() * 1000) + 500,
    paidAmount: Math.floor(Math.random() * 500),
    notes: Math.random() > 0.5 ? `Notes for reservation ${room.roomNumber}` : undefined,
  }));
};

// Export mock data
export const mockRooms = generateRooms(12);
export const mockGuests = generateGuests(mockRooms);
export const mockRequests = generateRequests(mockGuests, mockRooms);
export const mockReservations = generateReservations(mockRooms);
export const mockStaffMembers = generateStaffMembers(5);
