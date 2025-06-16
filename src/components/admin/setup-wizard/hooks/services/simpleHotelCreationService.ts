
import { supabase } from "@/integrations/supabase/client";
import { SetupData } from "../../types";

// Simple, bulletproof hotel code generation
const generateSimpleHotelCode = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HOTEL_${timestamp.slice(-6)}_${random}`;
};

export const createHotelSimple = async (setupData: SetupData, userId: string): Promise<string> => {
  console.log("[Simple Hotel Creation] Starting process...");
  
  // Generate a guaranteed unique code using timestamp + random
  const uniqueHotelCode = generateSimpleHotelCode();
  console.log("[Simple Hotel Creation] Generated unique code:", uniqueHotelCode);

  // Use the hotel name as provided (validation already done in the form)
  const hotelName = setupData.hotel.name.trim();
  console.log("[Simple Hotel Creation] Using hotel name:", hotelName);

  const hotelData = {
    name: hotelName,
    address: setupData.hotel.address?.trim() || null,
    contact_email: setupData.hotel.contactEmail?.trim() || null,
    contact_phone: setupData.hotel.contactPhone?.trim() || null,
    hotel_code: uniqueHotelCode,
  };

  console.log("[Simple Hotel Creation] Creating hotel with data:", hotelData);

  // Create hotel
  const { data: hotel, error: hotelError } = await supabase
    .from("hotels")
    .insert(hotelData)
    .select()
    .single();

  if (hotelError) {
    console.error("[Simple Hotel Creation] Hotel creation failed:", hotelError);
    throw new Error(`Failed to create hotel: ${hotelError.message}`);
  }

  console.log("[Simple Hotel Creation] Hotel created successfully:", hotel.id);

  // Associate user with hotel
  const { error: userError } = await supabase
    .from("users")
    .update({ hotel_id: hotel.id })
    .eq("id", userId);

  if (userError) {
    console.error("[Simple Hotel Creation] Failed to associate user:", userError);
    throw new Error(`Failed to associate user with hotel: ${userError.message}`);
  }

  console.log("[Simple Hotel Creation] User associated successfully");
  
  return hotel.id;
};
