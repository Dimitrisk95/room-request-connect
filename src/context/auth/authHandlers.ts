
import { User, UserRole } from "./types";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data with more realistic structure
export const mockHotels = [
  {
    id: "hotel1",
    name: "Marbella Hotel",
    address: "123 Beach Street, Marbella, Spain",
    contactEmail: "info@marbellahotel.com",
    contactPhone: "+34 123 456 789"
  }
];

export const mockUsers: Array<User & { password?: string }> = [
  {
    id: "admin1",
    name: "Hotel Admin",
    email: "admin@hotel.com",
    password: "admin123",
    role: "admin",
    hotelId: "hotel1"
  },
  {
    id: "staff1",
    name: "John Staff",
    email: "staff@hotel.com",
    password: "staff123",
    role: "staff",
    hotelId: "hotel1"
  }
];

export const mockGuests = [
  {
    id: "guest1",
    name: "Jane Guest",
    email: "guest@example.com",
    roomNumber: "101",
    checkIn: "2025-04-20",
    checkOut: "2025-04-25"
  }
];

// Expanded request creation with more robust logic
export const createRequest = (request: {
  title: string;
  description: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
}) => {
  const newRequest = {
    id: `req-${Date.now()}`,
    ...request,
    status: "pending" as "pending" | "in-progress" | "resolved" | "cancelled",
    createdAt: new Date().toISOString()
  };
  
  // Add to mock requests and log for debugging
  mockRequests.push(newRequest);
  console.log("Request created:", newRequest);
  return newRequest;
};

// Function to create a new staff account
export const createStaffAccount = (
  name: string, 
  email: string, 
  password: string, 
  role: UserRole = "staff",
  hotelId: string
) => {
  const newStaff: User = {
    id: `staff-${Date.now()}`,
    name,
    email,
    role,
    hotelId
  };
  
  mockUsers.push({...newStaff, password});
  return newStaff;
};

// Function to add a new hotel
export const addHotel = (
  name: string, 
  address: string, 
  contactEmail: string, 
  contactPhone: string
) => {
  const newHotel = {
    id: `hotel-${Date.now()}`,
    name,
    address,
    contactEmail,
    contactPhone
  };
  
  mockHotels.push(newHotel);
  return newHotel;
};
