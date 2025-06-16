
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { useToast } from "@/hooks/use-toast";
import { SetupData } from "../types";
import { useState } from "react";
import { validateHotelData, ensureUniqueHotelCode } from "./utils/hotelValidation";
import { createHotel, associateUserWithHotel } from "./services/hotelCreationService";
import { createRooms } from "./services/roomsCreationService";
import { handleSuccessfulRedirect } from "./services/redirectService";

export function useHotelSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateHotel = async (setupData: SetupData) => {
    console.log("[Hotel Setup] Starting hotel creation process...");
    console.log("[Hotel Setup] Current user:", user);
    console.log("[Hotel Setup] Setup data:", setupData);

    if (isCreating) {
      console.log("[Hotel Setup] Already creating, skipping duplicate request");
      return false;
    }

    if (!user) {
      console.error("[Hotel Setup] No user found, cannot create hotel");
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a hotel.",
        variant: "destructive",
      });
      return false;
    }

    setIsCreating(true);

    try {
      console.log("[Hotel Setup] Validating input data...");
      validateHotelData(setupData);

      console.log("[Hotel Setup] Input validation passed, checking for unique hotel code...");
      const finalHotelCode = await ensureUniqueHotelCode(setupData);

      if (finalHotelCode !== setupData.hotel.hotelCode.trim()) {
        toast({
          title: "Hotel Code Updated",
          description: `The code "${setupData.hotel.hotelCode}" was already taken. We've generated a unique code: "${finalHotelCode}"`,
        });
      }

      console.log("[Hotel Setup] Creating hotel with final code:", finalHotelCode);
      const createdHotelId = await createHotel(setupData, finalHotelCode);
      console.log("[Hotel Setup] Hotel created successfully with ID:", createdHotelId);

      await associateUserWithHotel(user.id, createdHotelId);

      try {
        await createRooms(setupData, createdHotelId);
      } catch (roomError) {
        console.error("[Hotel Setup] Failed to add rooms:", roomError);
        toast({
          title: "Room Creation Warning",
          description: "Your hotel was created but some rooms could not be added. You can add them from the dashboard.",
          variant: "destructive",
        });
      }

      console.log("[Hotel Setup] Hotel setup completed successfully");

      toast({
        title: "Success!",
        description: `Hotel "${setupData.hotel.name}" created successfully! Redirecting to admin dashboard...`,
      });

      handleSuccessfulRedirect(createdHotelId);
      return true;

    } catch (error: any) {
      console.error("[Hotel Setup] Error caught during creation:", error);
      
      let errorMessage = "Setup failed. Please try again.";
      if (error.message?.includes("duplicate key") || error.message?.includes("unique constraint")) {
        errorMessage = "A hotel with this code already exists. Please choose a different code.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Setup Error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      console.log("[Hotel Setup] Cleaning up, setting isCreating to false");
      setIsCreating(false);
    }
  };

  return { isCreating, handleCreateHotel };
}
