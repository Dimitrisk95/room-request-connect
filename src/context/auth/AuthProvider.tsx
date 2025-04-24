
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
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch full user details
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

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
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

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
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
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
    const targetHotelId = hotelId || (user?.role === "admin" ? user.hotelId : "550e8400-e29b-41d4-a716-446655440000");
    if (!targetHotelId) {
      throw new Error("Hotel ID is required");
    }
    return await handlers.createStaffAccount(name, email, password, role, targetHotelId);
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

