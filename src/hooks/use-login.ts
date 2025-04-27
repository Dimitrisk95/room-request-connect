
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "./use-toast";

export type LoginCredentials = {
  hotelCode: string;
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
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<LoginErrorType>(null);
  const isNewAdmin = searchParams.get('newAdmin') === 'true';
  
  // Show a welcome message for new admins
  useEffect(() => {
    if (isNewAdmin) {
      toast({
        title: "Welcome to Hotel Connect!",
        description: "Please log in to set up your hotel.",
      });
    }
  }, [isNewAdmin, toast]);

  const handleStaffLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Attempting staff login for:", credentials.email);
      localStorage.setItem("selectedHotel", credentials.hotelCode);
      const loggedInUser = await login(
        credentials.email,
        credentials.password,
        credentials.hotelCode
      );
      
      // If user is admin and has no hotel, redirect to setup
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
    user
  };
};
