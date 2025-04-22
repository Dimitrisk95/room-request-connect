
import { User, UserRole } from "./types";

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

// Add the missing mockRequests export
export const mockRequests = [
  {
    id: "req-1",
    title: "Extra towels needed",
    description: "Could we get some extra towels please?",
    roomNumber: "101",
    guestId: "guest1",
    guestName: "Jane Guest",
    category: "housekeeping",
    status: "pending" as "pending" | "in-progress" | "resolved" | "cancelled",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    createdAt: new Date().toISOString()
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

// Add the missing createAuthHandlers function
export const createAuthHandlers = ({ user, setUser, signupCode, setSignupCode }: {
  user: User | null;
  setUser: (user: User | null) => void;
  signupCode: string;
  setSignupCode: (code: string) => void;
}) => {
  // Login handler
  const login = async (email: string, password: string, role: UserRole, hotelId?: string) => {
    const user = mockUsers.find(u => u.email === email && u.password === password && u.role === role);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const { password: _, ...userWithoutPassword } = user;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
  };
  
  // Google login handler (mock)
  const loginWithGoogle = async (signupCode: string) => {
    // Mock Google login - in a real app this would integrate with Google OAuth
    setUser({
      id: `google-user-${Date.now()}`,
      name: "Google User",
      email: "google@example.com",
      role: "staff",
      hotelId: "hotel1"
    });
  };
  
  // Guest login handler
  const loginAsGuest = async (roomCode: string, roomNumber: string) => {
    // Mock guest login
    setUser({
      id: `guest-${Date.now()}`,
      name: "Guest User",
      email: `guest-${roomCode}@example.com`,
      role: "guest",
      roomNumber
    });
    localStorage.setItem("user", JSON.stringify({
      id: `guest-${Date.now()}`,
      name: "Guest User",
      email: `guest-${roomCode}@example.com`,
      role: "guest",
      roomNumber
    }));
  };
  
  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  
  return {
    login,
    loginWithGoogle,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};

// Add the missing generateCode function
export const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
