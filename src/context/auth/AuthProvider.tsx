import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType, User, UserRole } from "./types";
import { createAuthHandlers, generateCode } from "./authHandlers";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [signupCode, setSignupCode] = useState<string>(() => {
    const savedCode = localStorage.getItem("signupCode");
    return savedCode || generateCode();
  });

  const generateNewSignupCode = () => {
    const newCode = generateCode();
    setSignupCode(newCode);
    localStorage.setItem("signupCode", newCode);
  };

  useEffect(() => {
    if (!localStorage.getItem("signupCode")) {
      generateNewSignupCode();
    }
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    const msToMidnight = night.getTime() - now.getTime();
    const timeoutId = setTimeout(() => {
      generateNewSignupCode();
      const intervalId = setInterval(generateNewSignupCode, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, msToMidnight);
    return () => clearTimeout(timeoutId);
  }, []);

  const isAuthenticated = !!user;

  const handlers = createAuthHandlers({
    user,
    setUser,
    signupCode,
    setSignupCode,
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
        signupCode,
        generateNewSignupCode,
        ...handlers,
        createStaffAccount: createStaffAccountWrapper
      } as AuthContextType}
    >
      {children}
    </AuthContext.Provider>
  );
};
