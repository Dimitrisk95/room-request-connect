
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export interface HotelData {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
}

export const createHotel = async (hotelData: HotelData) => {
  try {
    logger.info('Creating hotel', hotelData);

    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .insert({
        name: hotelData.name,
        code: hotelData.code,
        contact_email: hotelData.email,
        contact_phone: hotelData.phone,
        address: hotelData.address
      })
      .select()
      .single();

    if (hotelError) {
      logger.error('Error creating hotel', hotelError);
      throw hotelError;
    }

    logger.info('Hotel created successfully', hotel);

    // Associate the current user with the hotel
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ hotel_id: hotel.id })
        .eq('id', user.id);

      if (userUpdateError) {
        logger.error('Error associating user with hotel', userUpdateError);
        throw userUpdateError;
      }

      logger.info('User associated with hotel successfully');
      
      // Store hotel ID in localStorage to trigger user profile refresh
      localStorage.setItem("pendingHotelId", hotel.id);
    }

    return hotel;
  } catch (error) {
    logger.error('Hotel creation failed', error);
    throw error;
  }
};

export const checkHotelNameExists = async (name: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (error) {
      logger.error('Error checking hotel name', error);
      return false;
    }

    return !!data;
  } catch (error) {
    logger.error('Error checking hotel name existence', error);
    return false;
  }
};
