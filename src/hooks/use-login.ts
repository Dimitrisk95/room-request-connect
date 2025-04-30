import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useStaffLogin, StaffLoginCredentials } from "./login/use-staff-login";
import { useGuestLogin, GuestCredentials } from "./login/use-guest-login";
import { useLoginNavigation } from "./login/use-login-navigation";

export type LoginCredentials = StaffLoginCredentials & {
  hotelCode?: string;
};

export type LoginErrorType = string | null;

export const useLogin = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use specialized login hooks
  const staffLogin = useStaffLogin();
  const guestLogin = useGuestLogin();
  
  // Extract password setup state from staff login
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // Use navigation utilities
  const navigation = useLoginNavigation(user, isAuthenticated, needsPasswordSetup || staffLogin.needsPasswordSetup);
  
  // Initialize password setup state from URL if present
  useEffect(() => {
    if (navigation.locationState?.showPasswordSetup && navigation.locationState?.email) {
      setNeedsPasswordSetup(true);
      setUserEmail(navigation.locationState.email);
    }
  }, [navigation.locationState]);
  
  // Combine staff login state with local state
  useEffect(() => {
    if (staffLogin.needsPasswordSetup) {
      setNeedsPasswordSetup(true);
      setUserEmail(staffLogin.userEmail);
    }
  }, [staffLogin.needsPasswordSetup, staffLogin.userEmail]);

  // Staff login wrapper with navigation
  const handleStaffLogin = async (credentials: LoginCredentials) => {
    try {
      const loggedInUser = await staffLogin.handleStaffLogin(credentials);
      
      // If user needs password setup, don't navigate
      if (staffLogin.needsPasswordSetup) {
        return;
      }
      
      // Otherwise, navigate based on user role
      if (loggedInUser) {
        navigation.navigateAfterStaffLogin(loggedInUser);
      }
    } catch (error) {
      // Error already handled in staffLogin.handleStaffLogin
    }
  };

  // Guest login wrapper with navigation
  const handleGuestLogin = async (credentials: GuestCredentials) => {
    try {
      const guestUser = await guestLogin.handleGuestLogin(credentials);
      navigation.navigateAfterGuestLogin(credentials.hotelCode, credentials.roomCode);
      return guestUser;
    } catch (error) {
      // Error already handled in guestLogin.handleGuestLogin
    }
  };

  // Password setup completion handler
  const handlePasswordSetupComplete = () => {
    setNeedsPasswordSetup(false);
    staffLogin.handlePasswordSetupComplete();
    navigate("/dashboard");
  };

  return {
    isLoading: staffLogin.isLoading || guestLogin.isLoading,
    loginError: staffLogin.loginError || guestLogin.loginError,
    handleStaffLogin,
    handleGuestLogin,
    resetLoginError: () => {
      staffLogin.resetLoginError();
      guestLogin.resetLoginError();
    },
    isAuthenticated,
    user,
    needsPasswordSetup: needsPasswordSetup || staffLogin.needsPasswordSetup,
    userEmail: userEmail || staffLogin.userEmail,
    handlePasswordSetupComplete
  };
};
