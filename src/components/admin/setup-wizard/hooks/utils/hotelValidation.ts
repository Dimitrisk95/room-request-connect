
import { SetupData } from "../../types";
import { validateHotelCodeFormat, generateUniqueHotelCode } from "@/components/settings/hotel-code/hotelCodeUtils";
import { supabase } from "@/integrations/supabase/client";

export const validateHotelData = (setupData: SetupData) => {
  if (!setupData.hotel.name.trim()) {
    throw new Error("Hotel name is required");
  }
  if (!setupData.hotel.hotelCode.trim()) {
    throw new Error("Hotel code is required");
  }

  const formatValidation = validateHotelCodeFormat(setupData.hotel.hotelCode);
  if (!formatValidation.isValid) {
    throw new Error(formatValidation.error || "Invalid hotel code format");
  }
};

export const ensureUniqueHotelCode = async (setupData: SetupData): Promise<string> => {
  const { data: existingHotel, error: checkError } = await supabase
    .from("hotels")
    .select("id")
    .eq("hotel_code", setupData.hotel.hotelCode.trim())
    .maybeSingle();

  if (checkError) {
    console.error("[Hotel Setup] Error checking existing hotel code:", checkError);
    throw new Error("Failed to validate hotel code. Please try again.");
  }

  if (existingHotel) {
    console.log("[Hotel Setup] Hotel code already exists, generating unique code...");
    try {
      const uniqueCode = await generateUniqueHotelCode(setupData.hotel.name, "");
      console.log("[Hotel Setup] Generated unique hotel code:", uniqueCode);
      return uniqueCode;
    } catch (error) {
      console.error("[Hotel Setup] Failed to generate unique code:", error);
      throw new Error("Failed to generate a unique hotel code. Please try a different code.");
    }
  }

  return setupData.hotel.hotelCode.trim();
};
