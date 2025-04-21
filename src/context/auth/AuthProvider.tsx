
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

  // Generate new signup code
  const generateNewSignupCode = () => {
    const newCode = generateCode();
    setSignupCode(newCode);
    localStorage.setItem("signupCode", newCode);
  };

  // Generate new code at midnight every day
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signupCode,
        generateNewSignupCode,
        ...handlers,
      } as AuthContextType}
    >
      {children}
    </AuthContext.Provider>
  );
};
