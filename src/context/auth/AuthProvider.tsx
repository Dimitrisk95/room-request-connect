
import React, { ReactNode, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType, User, UserRole } from "./types";
import { createAuthHandlers } from "./authHandlers";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only restore guest sessions from localStorage
        // For staff/admin, we'll rely on Supabase session
        if (parsedUser.role === "guest") {
          console.log("AuthProvider: Restoring guest session from localStorage");
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }

    // First set up auth state listener to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Avoid the Supabase auth deadlock by deferring data fetching
          setTimeout(async () => {
            try {
              const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', newSession.user!.email)
                .maybeSingle();

              if (userData) {
                const userObject: User = {
                  id: newSession.user!.id,
                  name: userData.name,
                  email: newSession.user!.email!,
                  role: userData.role,
                  hotelId: userData.hotel_id,
                };

                console.log("Setting authenticated user:", userObject.email);
                setUser(userObject);
                setSession(newSession);
                setIsAuthenticated(true);
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
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data }) => {
      console.log("Auth session check:", data.session ? "Found session" : "No session");
      
      if (data.session?.user) {
        setSession(data.session);
        
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
              };

              console.log("Found existing auth session:", userObject.email);
              setUser(userObject);
              setIsAuthenticated(true);
              localStorage.setItem("user", JSON.stringify(userObject));
            } else {
              console.warn("No matching user found in users table for:", data.session!.user.email);
            }
          } catch (error) {
            console.error("Error fetching user data from session:", error);
          }
        }, 0);
      }
      
      setIsInitializing(false);
    }).catch(error => {
      console.error("Error checking session:", error);
      setIsInitializing(false);
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const handlers = createAuthHandlers({
    user,
    setUser,
  });

  // Wrapper for logout to ensure redirect
  const logoutWrapper = async () => {
    try {
      await handlers.logout();
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (updatedUser: User) => {
    console.log("Updating user state:", updatedUser);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const createStaffAccountWrapper = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    try {
      console.log("Creating staff account:", email, role);
      return await handlers.createStaffAccount(name, email, password, role, hotelId);
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
        logout: logoutWrapper, // Use the wrapper that redirects
        createStaffAccount: createStaffAccountWrapper,
        updateUser
      }}
    >
      {!isInitializing ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
