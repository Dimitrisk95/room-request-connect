
import { supabase } from "@/integrations/supabase/client";
import { SetupData } from "../../types";

export const createHotel = async (setupData: SetupData, finalHotelCode: string): Promise<string> => {
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
    
    if (hotelError.message?.includes("duplicate key") || hotelError.message?.includes("unique constraint")) {
      throw new Error("A hotel with this code already exists. Please choose a different code.");
    }
    
    throw new Error(`Hotel creation failed: ${hotelError.message}`);
  }

  if (!hotelData) {
    console.error("[Hotel Setup] No hotel data returned after insert");
    throw new Error("Hotel creation failed: No data returned");
  }

  return hotelData.id;
};

export const associateUserWithHotel = async (userId: string, hotelId: string): Promise<void> => {
  console.log("[Hotel Setup] Updating user with hotel_id:", hotelId);
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({ hotel_id: hotelId })
    .eq("id", userId);

  if (userUpdateError) {
    console.error("[Hotel Setup] Failed to update user with hotel_id:", userUpdateError);
    throw new Error(`Failed to associate user with hotel: ${userUpdateError.message}`);
  }
};
