
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserData } from "./use-auth-user-data";
import { AuthState } from "./types/auth-state.types";

export interface SessionHandlerOptions {
  updateAuthState: (newState: Partial<AuthState>) => void;
}

/**
 * Hook for handling Supabase auth sessions
 */
export const useSessionHandler = ({ updateAuthState }: SessionHandlerOptions) => {
  useEffect(() => {
    console.log("SessionHandler: Initializing auth session");
    
    // First set up auth state listener to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Defer data fetching to avoid Supabase auth deadlock
          setTimeout(async () => {
            const userObject = await fetchUserData(newSession);
            
            if (userObject) {
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
          const userObject = await fetchUserData(data.session!);
          
          if (userObject) {
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
  }, [updateAuthState]);
};
