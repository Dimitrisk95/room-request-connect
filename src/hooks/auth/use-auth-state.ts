
import { useState, useEffect } from "react";
import { User } from "@/context/auth/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

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
  const updateAuthState = (
    newState: Partial<AuthState>
  ) => {
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

  useEffect(() => {
    console.log("AuthState: Initializing auth state");
    
    // Check for existing guest session in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only restore guest sessions from localStorage
        if (parsedUser.role === "guest") {
          console.log("AuthState: Restoring guest session from localStorage");
          updateAuthState({
            user: parsedUser,
            isAuthenticated: true
          });
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }

    // First set up auth state listener to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Defer data fetching to avoid Supabase auth deadlock
          setTimeout(async () => {
            try {
              const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', newSession.user!.email)
                .maybeSingle();

              if (userData) {
                // Make sure we capture and preserve the permission flags
                const userObject: User = {
                  id: newSession.user!.id,
                  name: userData.name,
                  email: newSession.user!.email!,
                  role: userData.role,
                  hotelId: userData.hotel_id,
                  // Include permission flags
                  can_manage_rooms: userData.can_manage_rooms || false,
                  can_manage_staff: userData.can_manage_staff || false
                };

                console.log("Auth state change: Setting authenticated user with permissions:", {
                  id: userObject.id,
                  email: userObject.email,
                  role: userObject.role,
                  can_manage_rooms: userObject.can_manage_rooms,
                  can_manage_staff: userObject.can_manage_staff
                });

                updateAuthState({
                  user: userObject,
                  session: newSession,
                  isAuthenticated: true
                });
                localStorage.setItem("user", JSON.stringify(userObject));
              } else if (error) {
                console.error("Error fetching user data:", error);
              } else {
                console.warn("No matching user found in users table for:", newSession.user!.email);
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          updateAuthState({
            user: null,
            session: null,
            isAuthenticated: false
          });
          localStorage.removeItem("user");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data }) => {
      console.log("Auth session check:", data.session ? "Found session" : "No session");
      
      if (data.session?.user) {
        updateAuthState({ session: data.session });
        
        // Defer data fetching to avoid deadlock
        setTimeout(async () => {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', data.session!.user.email)
              .maybeSingle();

            if (userData) {
              const userObject: User = {
                id: data.session!.user.id,
                name: userData.name,
                email: data.session!.user.email!,
                role: userData.role,
                hotelId: userData.hotel_id,
                // Include permission flags
                can_manage_rooms: userData.can_manage_rooms || false,
                can_manage_staff: userData.can_manage_staff || false
              };

              console.log("Found existing auth session with permissions:", {
                id: userObject.id,
                email: userObject.email,
                role: userObject.role,
                can_manage_rooms: userObject.can_manage_rooms,
                can_manage_staff: userObject.can_manage_staff
              });

              updateAuthState({
                user: userObject, 
                isAuthenticated: true
              });
              localStorage.setItem("user", JSON.stringify(userObject));
            } else {
              console.warn("No matching user found in users table for:", data.session!.user.email);
            }
          } catch (error) {
            console.error("Error fetching user data from session:", error);
          }
        }, 0);
      }
      
      updateAuthState({ isInitializing: false });
    }).catch(error => {
      console.error("Error checking session:", error);
      updateAuthState({ isInitializing: false });
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return {
    ...authState,
    updateAuthState,
    updateUser
  };
};
