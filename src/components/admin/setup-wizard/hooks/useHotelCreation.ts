
import { useState, useCallback } from "react";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SetupData } from "../types";

export const useHotelCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hotelCreated, setHotelCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  const handleCreateHotel = useCallback(async (setupData: SetupData) => {
    if (hotelCreated) {
      console.log("Hotel already created, skipping creation");
      return true;
    }

    setIsLoading(true);
    setError(null);
    console.log("Creating hotel with data:", setupData);

    try {
      // Insert the hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: setupData.hotel.name,
          address: setupData.hotel.address || null,
          contact_email: setupData.hotel.contactEmail || null,
          contact_phone: setupData.hotel.contactPhone || null,
          hotel_code: setupData.hotel.hotelCode || null
        })
        .select()
        .single();

      if (hotelError) {
        throw hotelError;
      }

      console.log("Hotel created successfully:", hotelData);
      const hotelId = hotelData.id;

      // Update the current user with the hotel ID
      if (user) {
        const { error: userError } = await supabase
          .from("users")
          .update({ hotel_id: hotelId })
          .eq("id", user.id);

        if (userError) {
          console.error("Error updating user with hotel ID:", userError);
          throw userError;
        }

        // Update the user context
        const updatedUser = { ...user, hotelId };
        updateUser(updatedUser);
        console.log("User updated with hotel ID:", hotelId);
      }

      // Add rooms if any were setup
      if (setupData.rooms.addRooms && setupData.rooms.roomsToAdd.length > 0) {
        console.log("Adding rooms:", setupData.rooms.roomsToAdd);
        
        const roomsWithHotelId = setupData.rooms.roomsToAdd.map(room => ({
          ...room,
          hotel_id: hotelId
        }));

        const { error: roomsError } = await supabase
          .from("rooms")
          .insert(roomsWithHotelId);

        if (roomsError) {
          console.error("Error adding rooms:", roomsError);
          toast.error("Some rooms could not be added. You can add them later in the dashboard.");
        }
      }

      // Everything succeeded!
      toast.success("Hotel setup completed successfully!");
      setHotelCreated(true);
      setIsLoading(false);
      console.log("Hotel creation completed successfully");
      
      return true;
      
    } catch (error: any) {
      console.error("Error setting up hotel:", error);
      setError(error.message || "Unknown error occurred");
      toast.error(`Setup failed: ${error.message || "Unknown error"}`);
      setIsLoading(false);
      return false;
    }
  }, [user, updateUser, hotelCreated]);

  return {
    isLoading,
    hotelCreated,
    setHotelCreated,
    error,
    handleCreateHotel
  };
};
