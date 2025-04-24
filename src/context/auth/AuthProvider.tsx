
import React, { ReactNode, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType, User, UserRole } from "./types";
import { createAuthHandlers } from "./authHandlers";
import { supabase } from "@/integrations/supabase/client";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only restore guest sessions from localStorage
        // For staff/admin, we'll rely on Supabase session
        if (parsedUser.role === "guest") {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }

    // Check Supabase session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch full user details
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (userData) {
            const userObject: User = {
              id: session.user.id,
              name: userData.name,
              email: session.user.email!,
              role: userData.role,
              hotelId: userData.hotel_id,
            };

            setUser(userObject);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userObject));
          } else if (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .maybeSingle();

            if (userData) {
              const userObject: User = {
                id: session.user.id,
                name: userData.name,
                email: session.user.email!,
                role: userData.role,
                hotelId: userData.hotel_id,
              };

              setUser(userObject);
              setIsAuthenticated(true);
              localStorage.setItem("user", JSON.stringify(userObject));
            } else if (error) {
              console.error("Error fetching user data:", error);
            }
          } catch (error) {
            console.error("Error in auth state change handler:", error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handlers = createAuthHandlers({
    user,
    setUser,
  });

  const createStaffAccountWrapper = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    try {
      const targetHotelId = hotelId || (user?.role === "admin" ? user.hotelId : "550e8400-e29b-41d4-a716-446655440000");
      if (!targetHotelId) {
        throw new Error("Hotel ID is required");
      }
      return await handlers.createStaffAccount(name, email, password, role, targetHotelId);
    } catch (error) {
      console.error("Staff account creation error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login: handlers.login,
        loginAsGuest: handlers.loginAsGuest,
        logout: handlers.logout,
        createStaffAccount: createStaffAccountWrapper
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
