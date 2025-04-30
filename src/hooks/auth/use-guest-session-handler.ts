
import { useEffect } from "react";
import { User } from "@/context/auth/types";
import { AuthState } from "./types/auth-state.types";

export interface GuestSessionHandlerOptions {
  updateAuthState: (newState: Partial<AuthState>) => void;
}

/**
 * Hook for handling guest user sessions (stored in localStorage)
 */
export const useGuestSessionHandler = ({ updateAuthState }: GuestSessionHandlerOptions) => {
  useEffect(() => {
    console.log("GuestSessionHandler: Checking for guest session");
    
    // Check for existing guest session in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only restore guest sessions from localStorage
        if (parsedUser.role === "guest") {
          console.log("GuestSessionHandler: Restoring guest session from localStorage");
          updateAuthState({
            user: parsedUser as User,
            isAuthenticated: true
          });
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }
  }, [updateAuthState]);
};
