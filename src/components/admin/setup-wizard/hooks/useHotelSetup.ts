
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
    if (isCreating) return;

    setIsCreating(true);

    try {
      if (!setupData.hotel.name.trim())
        throw new Error("Hotel name is required");
      if (!setupData.hotel.hotelCode.trim())
        throw new Error("Hotel code is required");

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

      if (hotelError) throw hotelError;

      const hotelId = hotelData.id;

      if (
        setupData.rooms.addRooms &&
        setupData.rooms.roomsToAdd.length > 0
      ) {
        const rooms = setupData.rooms.roomsToAdd.map((room: any) => ({
          ...room,
          hotel_id: hotelId,
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
          toast({
            title: "Room Creation Error",
            description:
              "Some rooms could not be added. You can add them later in the dashboard.",
            variant: "destructive",
          });
        }
      }

      if (
        setupData.staff.addStaff &&
        setupData.staff.staffToAdd.length > 0
      ) {
        for (const staff of setupData.staff.staffToAdd) {
          if (!staff.email || !staff.name) continue;

          const { error: staffError } = await supabase
            .from("users")
            .insert({
              name: staff.name,
              email: staff.email,
              role: "staff",
              hotel_id: hotelId,
              can_manage_rooms: !!staff.can_manage_rooms,
              can_manage_staff: !!staff.can_manage_staff,
              password_hash: "to-be-set",
              needs_password_setup: true,
              email_verified: false,
            });
          if (staffError) {
            toast({
              title: "Staff Creation Error",
              description: `Could not add staff: ${staff.name} (${staff.email}).`,
              variant: "destructive",
            });
          }
        }
      }

      // Update user with hotel_id
      if (user) {
        const { error: userError } = await supabase
          .from("users")
          .update({ hotel_id: hotelId })
          .eq("id", user.id);

        if (userError) throw userError;

        const updatedUser = { ...user, hotelId };
        updateUser(updatedUser);
      }

      toast({
        title: "Hotel setup completed successfully!",
        description: "Your hotel is now ready. Redirecting to dashboard...",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, debugMode ? 1 : 1500);

      return true;
    } catch (error: any) {
      let errorMessage = "Setup failed. Please try again.";
      if (error.message?.includes("duplicate key")) {
        errorMessage =
          "A hotel with this code already exists. Please choose a different code.";
      } else if (error.message) {
        errorMessage = error.message;
      }
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
