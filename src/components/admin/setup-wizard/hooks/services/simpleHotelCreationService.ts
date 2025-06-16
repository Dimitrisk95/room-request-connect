
import { supabase } from "@/integrations/supabase/client";
import { SetupData } from "../../types";

// Simple, bulletproof hotel code generation
const generateSimpleHotelCode = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HOTEL_${timestamp.slice(-6)}_${random}`;
};

// Check if hotel name exists and generate unique name if needed
const ensureUniqueHotelName = async (baseName: string): Promise<string> => {
  let uniqueName = baseName.trim();
  let counter = 1;

  while (true) {
    const { data: existingHotel, error } = await supabase
      .from("hotels")
      .select("id")
      .eq("name", uniqueName)
      .maybeSingle();

    if (error) {
      console.error("[Hotel Creation] Error checking hotel name:", error);
      throw new Error(`Failed to validate hotel name: ${error.message}`);
    }

    // If no hotel found with this name, we can use it
    if (!existingHotel) {
      return uniqueName;
    }

    // If hotel exists, try with a number suffix
    uniqueName = `${baseName.trim()} (${counter})`;
    counter++;

    // Safety check to prevent infinite loops
    if (counter > 100) {
      throw new Error("Unable to generate a unique hotel name. Please try a different name.");
    }
  }
};

export const createHotelSimple = async (setupData: SetupData, userId: string): Promise<string> => {
  console.log("[Simple Hotel Creation] Starting process...");
  
  // Generate a guaranteed unique code using timestamp + random
  const uniqueHotelCode = generateSimpleHotelCode();
  console.log("[Simple Hotel Creation] Generated unique code:", uniqueHotelCode);

  // Ensure hotel name is unique
  const uniqueHotelName = await ensureUniqueHotelName(setupData.hotel.name);
  console.log("[Simple Hotel Creation] Using hotel name:", uniqueHotelName);

  const hotelData = {
    name: uniqueHotelName,
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
