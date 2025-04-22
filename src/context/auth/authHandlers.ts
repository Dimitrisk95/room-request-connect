
import { AuthContextType, User, UserRole } from "./types";
import { useToast } from "@/hooks/use-toast";

// Mock data for hotels (in a real app this would come from a database)
export const mockHotels = [
  {
    id: "hotel1",
    name: "Marbella Hotel",
    address: "123 Beach Street, Marbella, Spain",
    contactEmail: "info@marbellahotel.com",
    contactPhone: "+34 123 456 789"
  }
];

// Mock user data - in a real app this would come from a backend
export const mockUsers: Array<User & { password?: string }> = [
  {
    id: "1",
    name: "Hotel Admin",
    email: "admin@hotel.com",
    password: "admin123",
    role: "admin",
    hotelId: "hotel1"
  },
  {
    id: "2",
    name: "Staff Member",
    email: "staff@hotel.com",
    password: "staff123",
    role: "staff",
    hotelId: "hotel1"
  }
];

// Mock guest data
export const mockGuests: Array<{id: string, name: string, email: string, roomNumber: string, checkIn: string, checkOut: string}> = [
  {
    id: "guest1",
    name: "John Doe",
    email: "john@example.com",
    roomNumber: "101",
    checkIn: "2025-04-20",
    checkOut: "2025-04-25"
  }
];

// Storage for mock requests
export let mockRequests: Array<{
  id: string;
  title: string;
  description: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
  status: "pending" | "in-progress" | "resolved" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: string;
}> = [
  {
    id: "req1",
    title: "Need extra towels",
    description: "Could I get some extra towels for the bathroom please?",
    roomNumber: "101",
    guestId: "guest1",
    guestName: "John Doe",
    status: "pending",
    priority: "medium",
    category: "housekeeping",
    createdAt: new Date().toISOString()
  }
];

// Helper to generate a 6-digit random code
export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Storage for room reservation data
export let mockReservations: Array<{
  id: string;
  roomNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
}> = [
  {
    id: "res1",
    roomNumber: "101",
    guestName: "John Doe",
    checkIn: "2025-04-20",
    checkOut: "2025-04-25",
    status: "confirmed"
  }
];

// Generate rooms for the hotel
export const generateRooms = () => {
  const rooms = [];
  for (let floor = 1; floor <= 3; floor++) {
    for (let room = 1; room <= 10; room++) {
      const roomNumber = `${floor}${room < 10 ? '0' : ''}${room}`;
      rooms.push({
        id: `room-${roomNumber}`,
        roomNumber,
        type: room % 3 === 0 ? "Suite" : room % 2 === 0 ? "Deluxe" : "Standard", 
        floor,
        capacity: room % 3 === 0 ? 4 : room % 2 === 0 ? 3 : 2,
        status: "vacant" as "vacant" | "occupied" | "maintenance" | "cleaning"
      });
    }
  }
  return rooms;
};

// Mock rooms data
export const mockRooms = generateRooms();

// Create a request
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
  
  mockRequests.push(newRequest);
  console.log("Request created:", newRequest);
  console.log("All requests:", mockRequests);
  return newRequest;
};

// Auth handler logic separated for testability and reuse
export const createAuthHandlers = ({
  user,
  setUser,
  signupCode,
  setSignupCode,
}: {
  user: User | null,
  setUser: (user: User | null) => void,
  signupCode: string,
  setSignupCode: (code: string) => void,
}) => {
  const { toast } = useToast();

  // Login function
  const login = async (
    email: string, password: string, role: UserRole, hotelId?: string
  ) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    if (!foundUser) {
      throw new Error("Invalid credentials");
    }
    const { password: _, ...userWithoutPassword } = foundUser;
    const userToStore = {
      ...userWithoutPassword,
      hotelId: hotelId || userWithoutPassword.hotelId
    };
    setUser(userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
  };

  // Login with Google
  const loginWithGoogle = async (inputSignupCode: string) => {
    if (inputSignupCode !== signupCode) {
      throw new Error("Invalid signup code");
    }
    try {
      toast({
        title: "Google Authentication",
        description: "Opening Google authentication popup..."
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      const confirmed = window.confirm("Simulated Google Login:\nWould you like to sign in with your Google account?");
      if (!confirmed) {
        throw new Error("Google authentication cancelled");
      }

      const mockGoogleUser = {
        id: `google-${Date.now()}`,
        name: "Google Staff",
        email: "google-staff@example.com",
        role: "staff" as UserRole,
        hotelId: localStorage.getItem("selectedHotel") || "hotel1"
      };

      setUser(mockGoogleUser);
      localStorage.setItem("user", JSON.stringify(mockGoogleUser));
      toast({
        title: "Google Login Successful",
        description: "You've been logged in with your Google account."
      });
    } catch (error) {
      if ((error as Error).message === "Google authentication cancelled") {
        toast({
          title: "Authentication Cancelled",
          description: "Google login was cancelled.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  // Create staff account by admin
  const createStaffAccount = async (
    name: string, email: string, password: string, role: UserRole
  ) => {
    if (user?.role !== "admin") {
      throw new Error("Only admins can create staff accounts");
    }
    const newStaffId = `staff-${Date.now()}`;
    const newStaff = {
      id: newStaffId,
      name,
      email,
      password,
      role,
      hotelId: user.hotelId
    };
    mockUsers.push(newStaff);
    toast({
      title: "Staff Account Created",
      description: `Created new ${role} account for ${name}`
    });
    return;
  };

  // Login as guest
  const loginAsGuest = async (roomCode: string, roomNumber: string) => {
    // In this mock implementation, we'll accept a simple code for testing
    if (roomCode === "123456") {
      // Find or create a guest for this room
      let guestId = `guest-${Date.now()}`;
      
      // Check if there's a reservation for this room
      const reservation = mockReservations.find(r => 
        r.roomNumber === roomNumber && 
        r.status === "confirmed"
      );
      
      const guestName = reservation?.guestName || "Guest";
      
      const guestUser = {
        id: guestId,
        name: guestName,
        email: "",
        role: "guest" as UserRole,
        roomNumber
      };
      
      setUser(guestUser);
      localStorage.setItem("user", JSON.stringify(guestUser));
      
      // If this is a new guest using the app, create a guest record
      if (!mockGuests.some(g => g.roomNumber === roomNumber)) {
        mockGuests.push({
          id: guestId,
          name: guestName,
          email: "",
          roomNumber,
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    } else {
      throw new Error("Invalid room code");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    login,
    loginWithGoogle,
    loginAsGuest,
    logout,
    createStaffAccount,
  };
};
