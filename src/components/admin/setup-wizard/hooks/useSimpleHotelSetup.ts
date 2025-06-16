
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { useToast } from "@/hooks/use-toast";
import { SetupData } from "../types";
import { useState } from "react";
import { createHotelSimple } from "./services/simpleHotelCreationService";

export function useSimpleHotelSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createHotel = async (setupData: SetupData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a hotel.",
        variant: "destructive",
      });
      return false;
    }

    if (!setupData.hotel.name.trim()) {
      toast({
        title: "Error",
        description: "Hotel name is required.",
        variant: "destructive",
      });
      return false;
    }

    if (isCreating) {
      console.log("[Simple Hotel Setup] Already creating, ignoring duplicate request");
      return false;
    }

    setIsCreating(true);
    console.log("[Simple Hotel Setup] Starting hotel creation...");

    try {
      const hotelId = await createHotelSimple(setupData, user.id);
      
      toast({
        title: "Success!",
        description: `Hotel created successfully! Redirecting...`,
      });

      // Store hotel ID and redirect
      localStorage.setItem("pendingHotelId", hotelId);
      
      setTimeout(() => {
        console.log("[Simple Hotel Setup] Redirecting to admin dashboard");
        window.location.href = "/admin-dashboard";
      }, 1500);

      return true;
    } catch (error: any) {
      console.error("[Simple Hotel Setup] Creation failed:", error);
      
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to create hotel. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, createHotel };
}
