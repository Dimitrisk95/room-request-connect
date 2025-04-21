
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define user roles
export type UserRole = "admin" | "staff" | "guest";

// Define user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId?: string; // For staff and admin
  roomNumber?: string; // For guests
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole, hotelId?: string) => Promise<void>;
  loginWithGoogle: (signupCode: string) => Promise<void>;
  loginAsGuest: (roomCode: string, roomNumber: string) => Promise<void>;
  logout: () => void;
  createStaffAccount: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  signupCode: string;
  generateNewSignupCode: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Generate a random 6-digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock user data - in a real app this would come from a backend
const mockUsers = [
  {
    id: "1",
    name: "Hotel Admin",
    email: "admin@hotel.com",
    password: "admin123",
    role: "admin" as UserRole,
    hotelId: "hotel1"
  },
  {
    id: "2",
    name: "Staff Member",
    email: "staff@hotel.com",
    password: "staff123",
    role: "staff" as UserRole,
    hotelId: "hotel1"
  }
];

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [signupCode, setSignupCode] = useState<string>(() => {
    const savedCode = localStorage.getItem("signupCode");
    return savedCode || generateCode();
  });
  const { toast } = useToast();

  // Generate new signup code
  const generateNewSignupCode = () => {
    const newCode = generateCode();
    setSignupCode(newCode);
    localStorage.setItem("signupCode", newCode);
  };

  // Generate new code at midnight every day
  useEffect(() => {
    // Set initial code if not exists
    if (!localStorage.getItem("signupCode")) {
      generateNewSignupCode();
    }

    // Calculate time until midnight
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // next day
      0, 0, 0 // midnight
    );
    const msToMidnight = night.getTime() - now.getTime();

    // Set timeout to generate new code at midnight
    const timeoutId = setTimeout(() => {
      generateNewSignupCode();
      // Setup daily interval after first midnight
      const intervalId = setInterval(generateNewSignupCode, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, msToMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Login function
  const login = async (email: string, password: string, role: UserRole, hotelId?: string) => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    // Remove password before storing user
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Update hotelId if provided
    const userToStore = {
      ...userWithoutPassword,
      hotelId: hotelId || userWithoutPassword.hotelId
    };
    
    // Set user in state and localStorage
    setUser(userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
  };

  // Login with Google
  const loginWithGoogle = async (inputSignupCode: string) => {
    // Verify the signup code
    if (inputSignupCode !== signupCode) {
      throw new Error("Invalid signup code");
    }

    // In a real implementation, this would authenticate with Supabase and Google
    try {
      // Simulate Google OAuth popup
      toast({
        title: "Google Authentication",
        description: "Opening Google authentication popup...",
      });
      
      // Simulate a delay for the popup and authentication process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show a simulated Google login popup - in a real app this would be handled by Google
      const confirmed = window.confirm("Simulated Google Login:\nWould you like to sign in with your Google account?");
      
      if (!confirmed) {
        throw new Error("Google authentication cancelled");
      }
      
      // Simulate successful login after user confirms
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
        description: "You've been logged in with your Google account.",
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
  const createStaffAccount = async (name: string, email: string, password: string, role: UserRole) => {
    // Validate that only admin can create staff accounts
    if (user?.role !== "admin") {
      throw new Error("Only admins can create staff accounts");
    }

    // In a real app, this would create a new user in the database
    const newStaffId = `staff-${Date.now()}`;
    const newStaff = {
      id: newStaffId,
      name,
      email,
      password, // In a real app, this would be hashed
      role,
      hotelId: user.hotelId
    };

    // Add to mock users (in a real app, this would be saved to a database)
    mockUsers.push(newStaff);
    
    return;
  };

  // Login as guest
  const loginAsGuest = async (roomCode: string, roomNumber: string) => {
    // In a real app, this would validate the room code against a database
    if (roomCode === "123456") { // Mock validation
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

  // Return provider with auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        loginAsGuest,
        logout,
        createStaffAccount,
        signupCode,
        generateNewSignupCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
