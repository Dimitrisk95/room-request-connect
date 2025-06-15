
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SetupData } from "../types";
import { useState } from "react";

export function useHotelSetup() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateHotel = async (setupData: SetupData) => {
    console.log("[Hotel Setup] Starting hotel creation process...");
    console.log("[Hotel Setup] Current user:", user);
    console.log("[Hotel Setup] Setup data:", setupData);
    console.log("[Hotel Setup] isCreating state:", isCreating);

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

      if (!setupData.hotel.name.trim()) {
        throw new Error("Hotel name is required");
      }
      if (!setupData.hotel.hotelCode.trim()) {
        throw new Error("Hotel code is required");
      }

      console.log("[Hotel Setup] Input validation passed, creating hotel...");

      // Create hotel
      const hotelInsertData = {
        name: setupData.hotel.name.trim(),
        address: setupData.hotel.address?.trim() || null,
        contact_email: setupData.hotel.contactEmail?.trim() || null,
        contact_phone: setupData.hotel.contactPhone?.trim() || null,
        hotel_code: setupData.hotel.hotelCode.trim(),
      };

      console.log("[Hotel Setup] Inserting hotel with data:", hotelInsertData);

      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert(hotelInsertData)
        .select()
        .single();

      if (hotelError) {
        console.error("[Hotel Setup] Hotel insert error:", hotelError);
        throw new Error(`Hotel creation failed: ${hotelError.message}`);
      }

      if (!hotelData) {
        console.error("[Hotel Setup] No hotel data returned after insert");
        throw new Error("Hotel creation failed: No data returned");
      }

      const createdHotelId = hotelData.id;
      console.log("[Hotel Setup] Hotel created successfully with ID:", createdHotelId);

      // Update the current user with the hotel ID
      console.log("[Hotel Setup] Updating user with hotel ID...");
      const { error: userError } = await supabase
        .from("users")
        .update({ hotel_id: createdHotelId })
        .eq("id", user.id);

      if (userError) {
        console.error("[Hotel Setup] Error updating user:", userError);
        throw new Error(`Failed to assign hotel to user: ${userError.message}`);
      }

      console.log("[Hotel Setup] User updated successfully in database");

      // Add rooms if requested
      if (
        setupData.rooms.addRooms &&
        setupData.rooms.roomsToAdd &&
        setupData.rooms.roomsToAdd.length > 0
      ) {
        console.log("[Hotel Setup] Adding rooms:", setupData.rooms.roomsToAdd.length);
        
        const rooms = setupData.rooms.roomsToAdd.map((room: any) => ({
          ...room,
          hotel_id: createdHotelId,
          status: room.status || "vacant",
          bed_type: room.bedType || "single",
          room_number: room.roomNumber,
          type: room.type || "standard",
          capacity: room.capacity || 2,
        }));

        const { error: roomsError } = await supabase
          .from("rooms")
          .insert(rooms);

        if (roomsError) {
          console.error("[Hotel Setup] Failed to add rooms:", roomsError);
          toast({
            title: "Room Creation Warning",
            description: "Your hotel was created but some rooms could not be added. You can add them from the dashboard.",
            variant: "destructive",
          });
        } else {
          console.log("[Hotel Setup] Rooms added successfully");
        }
      }

      toast({
        title: "Success!",
        description: "Hotel setup completed successfully! Please log in again to access your hotel dashboard.",
      });

      // Sign out the user and redirect to login to refresh the session
      setTimeout(async () => {
        try {
          await signOut();
          window.location.href = "/auth";
        } catch (error) {
          console.error("[Hotel Setup] Error during sign out:", error);
          // Even if sign out fails, redirect to auth page
          window.location.href = "/auth";
        }
      }, 2000);

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
