
import React, { ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType, User, UserRole } from "./types";
import { createAuthHandlers } from "./authHandlers";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const handlers = createAuthHandlers({
    user,
    setUser
  });

  const createStaffAccountWrapper = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    const targetHotelId = hotelId || (user?.role === "admin" ? user.hotelId : "550e8400-e29b-41d4-a716-446655440000");
    if (!targetHotelId) {
      throw new Error("Hotel ID is required");
    }
    await handlers.createStaffAccount(name, email, password, role, targetHotelId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        ...handlers,
        createStaffAccount: createStaffAccountWrapper
      } as AuthContextType}
    >
      {children}
    </AuthContext.Provider>
  );
};
