
import React, { ReactNode, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { User, UserRole } from "./types";
import { useAuthState } from "@/hooks/auth/use-auth-state";
import { useAuthHandlers } from "@/hooks/auth/use-auth-handlers";
import { useAuthNavigation } from "@/hooks/auth/use-auth-navigation";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use the refactored auth state hook
  const {
    user,
    session,
    isAuthenticated,
    isInitializing,
    updateUser
  } = useAuthState();

  // Helper to clear user during logout
  const clearUser = useCallback(() => {
    localStorage.removeItem("user");
  }, []);

  // Use the refactored auth handlers
  const authHandlers = useAuthHandlers({
    updateUser,
    clearUser
  });

  // Use the navigation hook for auth redirects
  const navigation = useAuthNavigation();

  // Improved logout wrapper for faster response
  const logoutWrapper = async () => {
    try {
      console.log("Logout initiated");
      
      // Get the target URL before logout to avoid delays
      const targetUrl = navigation.navigateAfterLogout();
      
      // Clear user state immediately for faster UI response
      clearUser();
      
      // Execute logout in the background
      authHandlers.logout()
        .then(() => {
          console.log("Logout completed successfully");
        })
        .catch(error => {
          console.error("Logout error:", error);
        });
      
      // Redirect immediately after logout initiated
      console.log("Redirecting to:", targetUrl);
      window.location.href = targetUrl;
    } catch (error) {
      console.error("Logout wrapper error:", error);
      // Redirect anyway in case of error to ensure user can get to login screen
      window.location.href = "/login";
    }
  };

  // Wrapper for staff account creation
  const createStaffAccountWrapper = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    try {
      console.log("Creating staff account:", email, role);
      return await authHandlers.createStaffAccount(name, email, password, role, hotelId);
    } catch (error) {
      console.error("Staff account creation error:", error);
      throw error;
    }
  };

  // Wrapper for login to handle navigation
  const loginWrapper = async (email: string, password: string, hotelCode: string) => {
    const user = await authHandlers.login(email, password, hotelCode);
    return user;
  };

  // Wrapper for guest login to handle navigation
  const loginAsGuestWrapper = async (hotelCode: string, roomCode: string) => {
    const user = await authHandlers.loginAsGuest(hotelCode, roomCode);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login: loginWrapper,
        loginAsGuest: loginAsGuestWrapper,
        logout: logoutWrapper,
        createStaffAccount: createStaffAccountWrapper,
        updateUser
      }}
    >
      {!isInitializing ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
