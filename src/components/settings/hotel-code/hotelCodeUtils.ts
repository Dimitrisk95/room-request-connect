
import { generateHotelCode } from '@/utils/codeGenerator';
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates the format of a hotel code
 */
export const validateHotelCodeFormat = (code: string): { isValid: boolean; error?: string } => {
  // Check if code only contains alphanumeric characters
  if (!/^[a-zA-Z0-9]+$/.test(code)) {
    return { 
      isValid: false, 
      error: "Hotel code can only contain letters and numbers (no spaces or special characters)"
    };
  }
  
  // Check length requirements
  if (code.length < 3 || code.length > 20) {
    return { 
      isValid: false, 
      error: "Hotel code must be between 3 and 20 characters" 
    };
  }
  
  return { isValid: true };
};

/**
 * Checks if a hotel code is available (not used by another hotel)
 */
export const checkHotelCodeAvailability = async (
  code: string, 
  currentHotelId: string
): Promise<{ isAvailable: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('id')
      .eq('hotel_code', code)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    if (data && data.id !== currentHotelId) {
      return { 
        isAvailable: false, 
        error: "This hotel code is already taken. Please try another one."
      };
    }
    
    return { isAvailable: true };
  } catch (error) {
    console.error('Error checking code availability:', error);
    return { 
      isAvailable: false, 
      error: "Error checking code availability. Please try again."
    };
  }
};

/**
 * Generates a unique hotel code based on the hotel name
 */
export const generateUniqueHotelCode = async (
  hotelName: string, 
  hotelId: string
): Promise<string> => {
  // Try up to 5 times to generate a unique code
  for (let i = 0; i < 5; i++) {
    const code = generateHotelCode(hotelName);
    const { isAvailable } = await checkHotelCodeAvailability(code, hotelId);
    
    if (isAvailable) {
      return code;
    }
  }
  
  // If all attempts failed, append a random number
  const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
  return `${hotelName.substring(0, 3).toUpperCase()}${randomSuffix}`;
};

/**
 * Updates a hotel's code in the database
 */
export const updateHotelCodeInDatabase = async (
  hotelId: string,
  newCode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('hotels')
      .update({ hotel_code: newCode })
      .eq('id', hotelId);

    if (error) throw error;
    
    // Success
    return { success: true };
  } catch (error) {
    console.error('Error updating hotel code:', error);
    return { 
      success: false, 
      error: "Failed to update hotel code. Please try again."
    };
  }
};
