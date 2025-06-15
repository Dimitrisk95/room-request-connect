
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SetupData } from "../types";
import { useState } from "react";

export function useHotelSetup() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateHotel = async (
    setupData: SetupData,
    debugMode = false
  ) => {
    if (isCreating) {
      console.log("Already creating, skipping duplicate request");
      return;
    }

    setIsCreating(true);
    let createdHotelId = null;

    try {
      console.log("[Hotel Setup] Creating hotel with data:", setupData);

      if (!setupData.hotel.name.trim()) throw new Error("Hotel name is required");
      if (!setupData.hotel.hotelCode.trim()) throw new Error("Hotel code is required");

      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: setupData.hotel.name.trim(),
          address: setupData.hotel.address?.trim() || null,
          contact_email: setupData.hotel.contactEmail?.trim() || null,
          contact_phone: setupData.hotel.contactPhone?.trim() || null,
          hotel_code: setupData.hotel.hotelCode.trim(),
        })
        .select()
        .single();

      if (hotelError) {
        console.error("[Hotel Setup] Hotel insert error:", hotelError);
        throw hotelError;
      }

      createdHotelId = hotelData.id;
      console.log("[Hotel Setup] Hotel created with id:", createdHotelId);

      // Add rooms if requested (can be optional)
      if (
        setupData.rooms.addRooms &&
        setupData.rooms.roomsToAdd &&
        setupData.rooms.roomsToAdd.length > 0
      ) {
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
            title: "Room Creation Error",
            description: "Some rooms could not be added, but your hotel was created. You can add rooms from the dashboard.",
            variant: "destructive",
          });
        }
      }

      // Assign this hotel to admin user
      if (user && createdHotelId) {
        const { error: userError } = await supabase
          .from("users")
          .update({ hotel_id: createdHotelId })
          .eq("id", user.id);

        if (userError) {
          console.error("[Hotel Setup] Error updating user:", userError);
          toast({
            title: "User Update Error",
            description: "Could not assign hotel to your account. Contact support.",
            variant: "destructive",
          });
          throw userError;
        }

        // Update local auth context
        const updatedUser = { ...user, hotelId: createdHotelId };
        updateUser(updatedUser);
        console.log("[Hotel Setup] Updated user with hotelId in context");
      }

      toast({
        title: "Hotel setup completed successfully!",
        description: "Your hotel is now ready. Redirecting to dashboard...",
      });

      // Give user a second for UI toast, then force-redirect to /dashboard
      setTimeout(() => {
        // Use window.location for a hard redirect to avoid stale context problems
        // Can use navigate if you trust React state
        window.location.replace("/dashboard");
      }, debugMode ? 100 : 1500);

      return true;
    } catch (error: any) {
      let errorMessage = "Setup failed. Please try again.";
      if (error.message?.includes("duplicate key")) {
        errorMessage =
          "A hotel with this code already exists. Please choose a different code.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error("[Hotel Setup] Error caught:", errorMessage, error);
      toast({
        title: "Setup Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
    return false;
  };

  return { isCreating, handleCreateHotel };
}
