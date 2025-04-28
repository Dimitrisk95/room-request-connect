import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export type LoginCredentials = {
  hotelCode?: string;
  email: string;
  password: string;
};

export type GuestCredentials = {
  hotelCode: string;
  roomCode: string;
};

export type LoginErrorType = string | null;

export const useLogin = () => {
  const { login, loginAsGuest, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<LoginErrorType>(null);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const locationState = location.state as { showPasswordSetup?: boolean, email?: string } | null;
  
  useEffect(() => {
    if (locationState?.showPasswordSetup && locationState?.email) {
      setNeedsPasswordSetup(true);
      setUserEmail(locationState.email);
    }
  }, [locationState]);
  
  const isNewAdmin = searchParams.get('newAdmin') === 'true';
  
  useEffect(() => {
    if (isNewAdmin) {
      toast({
        title: "Welcome to Hotel Connect!",
        description: "Please log in to set up your hotel.",
      });
    }
  }, [isNewAdmin, toast]);

  useEffect(() => {
    if (isAuthenticated && !needsPasswordSetup) {
      console.log("User already authenticated, redirecting with permissions:", {
        role: user?.role,
        can_manage_rooms: user?.can_manage_rooms,
        can_manage_staff: user?.can_manage_staff
      });
      
      if (user?.role === "guest") {
        navigate(`/guest/${user.hotelId}/${user.roomNumber}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, needsPasswordSetup, user, navigate]);

  const handleStaffLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Attempting staff login for:", credentials.email);
      
      // Find user's hotel by email
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('hotel_id, can_manage_rooms, can_manage_staff')
        .eq('email', credentials.email)
        .single();
      
      if (userDataError) {
        console.error("Error finding user's hotel:", userDataError);
        throw new Error("User not found. Please check your email or contact your administrator.");
      }
      
      console.log("Found user data:", userData);
      
      // Use the hotel ID from the user's profile
      const hotelId = userData?.hotel_id;
      if (hotelId) {
        localStorage.setItem("selectedHotel", hotelId);
      }
      
      const loggedInUser = await login(
        credentials.email,
        credentials.password,
        hotelId || ""
      );

      console.log("Login successful, user permissions:", {
        role: loggedInUser.role,
        can_manage_rooms: loggedInUser.can_manage_rooms,
        can_manage_staff: loggedInUser.can_manage_staff
      });

      const { data: userSetupData, error: userSetupError } = await supabase
        .from('users')
        .select('needs_password_setup')
        .eq('email', credentials.email)
        .single();

      if (userSetupError) {
        console.error("Error checking needs_password_setup:", userSetupError);
        throw userSetupError;
      }

      if (userSetupData?.needs_password_setup) {
        setNeedsPasswordSetup(true);
        setUserEmail(credentials.email);
        return; // Stop here, showing password setup form
      }
      
      if (loggedInUser.role === "admin" && !loggedInUser.hotelId) {
        navigate("/setup");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Staff login error:", error);
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes("not found")) {
          errorMessage = "User account not found. Please register first."; 
        } else if (error.message.includes("profile not found")) {
          errorMessage = "User profile is incomplete. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setLoginError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async (credentials: GuestCredentials) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      localStorage.setItem("selectedHotel", credentials.hotelCode);
      await loginAsGuest(
        credentials.hotelCode,
        credentials.roomCode
      );
      navigate(`/guest/${credentials.hotelCode}/${credentials.roomCode}`);
    } catch (error: any) {
      console.error("Guest login error:", error);
      setLoginError("Invalid hotel or room code. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid hotel or room code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSetupComplete = () => {
    setNeedsPasswordSetup(false);
    navigate("/dashboard");
    toast({
      title: "Welcome to Hotel Connect",
      description: "Your password has been set successfully.",
    });
  };

  const resetLoginError = () => {
    setLoginError(null);
  };

  return {
    isLoading,
    loginError,
    handleStaffLogin,
    handleGuestLogin,
    resetLoginError,
    isAuthenticated,
    user,
    needsPasswordSetup,
    userEmail,
    handlePasswordSetupComplete
  };
};
