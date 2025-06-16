
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SetupData } from "../types";
import { useState } from "react";
import { refreshUserProfile } from "@/components/auth/userProfileService";
import { generateUniqueHotelCode, validateHotelCodeFormat } from "@/components/settings/hotel-code/hotelCodeUtils";

export function useHotelSetup() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

      if (!setupData.hotel.name.trim()) {
        throw new Error("Hotel name is required");
      }
      if (!setupData.hotel.hotelCode.trim()) {
        throw new Error("Hotel code is required");
      }

      // Validate hotel code format
      const formatValidation = validateHotelCodeFormat(setupData.hotel.hotelCode);
      if (!formatValidation.isValid) {
        throw new Error(formatValidation.error || "Invalid hotel code format");
      }

      console.log("[Hotel Setup] Input validation passed, checking for unique hotel code...");

      // Check if the hotel code already exists
      const { data: existingHotel, error: checkError } = await supabase
        .from("hotels")
        .select("id")
        .eq("hotel_code", setupData.hotel.hotelCode.trim())
        .maybeSingle();

      if (checkError) {
        console.error("[Hotel Setup] Error checking existing hotel code:", checkError);
        throw new Error("Failed to validate hotel code. Please try again.");
      }

      let finalHotelCode = setupData.hotel.hotelCode.trim();

      // If hotel code exists, generate a unique one
      if (existingHotel) {
        console.log("[Hotel Setup] Hotel code already exists, generating unique code...");
        try {
          finalHotelCode = await generateUniqueHotelCode(setupData.hotel.name, "");
          console.log("[Hotel Setup] Generated unique hotel code:", finalHotelCode);
          
          toast({
            title: "Hotel Code Updated",
            description: `The code "${setupData.hotel.hotelCode}" was already taken. We've generated a unique code: "${finalHotelCode}"`,
          });
        } catch (error) {
          console.error("[Hotel Setup] Failed to generate unique code:", error);
          throw new Error("Failed to generate a unique hotel code. Please try a different code.");
        }
      }

      console.log("[Hotel Setup] Creating hotel with final code:", finalHotelCode);

      // Create hotel
      const hotelInsertData = {
        name: setupData.hotel.name.trim(),
        address: setupData.hotel.address?.trim() || null,
        contact_email: setupData.hotel.contactEmail?.trim() || null,
        contact_phone: setupData.hotel.contactPhone?.trim() || null,
        hotel_code: finalHotelCode,
      };

      console.log("[Hotel Setup] Inserting hotel with data:", hotelInsertData);

      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert(hotelInsertData)
        .select()
        .single();

      if (hotelError) {
        console.error("[Hotel Setup] Hotel insert error:", hotelError);
        
        // Handle specific duplicate key error
        if (hotelError.message?.includes("duplicate key") || hotelError.message?.includes("unique constraint")) {
          throw new Error("A hotel with this code already exists. Please choose a different code.");
        }
        
        throw new Error(`Hotel creation failed: ${hotelError.message}`);
      }

      if (!hotelData) {
        console.error("[Hotel Setup] No hotel data returned after insert");
        throw new Error("Hotel creation failed: No data returned");
      }

      const createdHotelId = hotelData.id;
      console.log("[Hotel Setup] Hotel created successfully with ID:", createdHotelId);

      // Update user with hotel_id
      console.log("[Hotel Setup] Updating user with hotel_id:", createdHotelId);
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ hotel_id: createdHotelId })
        .eq("id", user.id);

      if (userUpdateError) {
        console.error("[Hotel Setup] Failed to update user with hotel_id:", userUpdateError);
        throw new Error(`Failed to associate user with hotel: ${userUpdateError.message}`);
      }

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

      console.log("[Hotel Setup] Hotel setup completed successfully");

      toast({
        title: "Success!",
        description: `Hotel "${setupData.hotel.name}" created successfully! Redirecting to admin dashboard...`,
      });

      // Store the hotel ID temporarily to help with auth refresh
      localStorage.setItem("pendingHotelId", createdHotelId);

      // Force a complete page reload to refresh all auth state
      setTimeout(() => {
        console.log("[Hotel Setup] Redirecting to admin dashboard with page reload");
        window.location.href = "/admin-dashboard";
      }, 1500);

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
