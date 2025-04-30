
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context";

export type StaffLoginCredentials = {
  email: string;
  password: string;
};

export const useStaffLogin = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleStaffLogin = async (credentials: StaffLoginCredentials) => {
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
      
      return loggedInUser;
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetLoginError = () => {
    setLoginError(null);
  };
  
  const handlePasswordSetupComplete = () => {
    setNeedsPasswordSetup(false);
  };

  return {
    isLoading,
    loginError,
    handleStaffLogin,
    resetLoginError,
    needsPasswordSetup,
    userEmail,
    handlePasswordSetupComplete
  };
};
