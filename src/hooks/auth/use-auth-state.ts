
import { useState } from "react";
import { User } from "@/context/auth/types";
import { AuthState } from "./types/auth-state.types";
import { useSessionHandler } from "./use-session-handler";
import { useGuestSessionHandler } from "./use-guest-session-handler";

/**
 * Hook to manage authentication state
 * This separates the core auth state management from the AuthProvider
 */
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isInitializing: true
  });

  // Update the complete auth state at once for consistency
  const updateAuthState = (newState: Partial<AuthState>) => {
    setAuthState(currentState => ({
      ...currentState,
      ...newState
    }));
  };

  // Set user and persist to localStorage
  const updateUser = (updatedUser: User) => {
    console.log("Updating user state with permissions:", {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      can_manage_rooms: updatedUser.can_manage_rooms,
      can_manage_staff: updatedUser.can_manage_staff
    });
    
    updateAuthState({ user: updatedUser, isAuthenticated: true });
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Handle Supabase authenticated sessions
  useSessionHandler({ updateAuthState });
  
  // Handle guest sessions (stored in localStorage)
  useGuestSessionHandler({ updateAuthState });

  return {
    ...authState,
    updateAuthState,
    updateUser
  };
};
