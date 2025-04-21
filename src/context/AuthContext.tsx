
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginAsGuest: (roomCode: string, roomNumber: string) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

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

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Login function
  const login = async (email: string, password: string, role: UserRole) => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    // Remove password before storing user
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Set user in state and localStorage
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
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
        loginAsGuest,
        logout
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
