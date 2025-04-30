
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context";
import { User } from "@/context/auth/types";

export type GuestCredentials = {
  hotelCode: string;
  roomCode: string;
};

export const useGuestLogin = () => {
  const { loginAsGuest } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGuestLogin = async (credentials: GuestCredentials): Promise<User> => {
    setIsLoading(true);
    setLoginError(null);

    try {
      localStorage.setItem("selectedHotel", credentials.hotelCode);
      const guestUser = await loginAsGuest(
        credentials.hotelCode,
        credentials.roomCode
      );
      return guestUser;
    } catch (error: any) {
      console.error("Guest login error:", error);
      const errorMessage = "Invalid hotel or room code. Please try again.";
      
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

  return {
    isLoading,
    loginError,
    handleGuestLogin,
    resetLoginError
  };
};
