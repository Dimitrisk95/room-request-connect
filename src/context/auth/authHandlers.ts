
import { AuthContextType, User, UserRole } from "./types";
import { useToast } from "@/hooks/use-toast";

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

// Helper to generate a 6-digit random code
export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    return;
  };

  // Login as guest
  const loginAsGuest = async (roomCode: string, roomNumber: string) => {
    if (roomCode === "123456") {
      const guestUser = {
        id: `guest-${Date.now()}`,
        name: "Guest",
        email: "",
        role: "guest" as UserRole,
        roomNumber
      };
      setUser(guestUser);
      localStorage.setItem("user", JSON.stringify(guestUser));
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
