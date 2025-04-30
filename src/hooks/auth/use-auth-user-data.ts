
import { User } from "@/context/auth/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

/**
 * Fetches user data from Supabase based on session information
 */
export const fetchUserData = async (session: Session): Promise<User | null> => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .maybeSingle();

    if (userData) {
      const userObject: User = {
        id: session.user.id,
        name: userData.name,
        email: session.user.email!,
        role: userData.role,
        hotelId: userData.hotel_id,
        can_manage_rooms: userData.can_manage_rooms || false,
        can_manage_staff: userData.can_manage_staff || false
      };
      
      return userObject;
    } else if (error) {
      console.error("Error fetching user data:", error);
    } else {
      console.warn("No matching user found in users table for:", session.user.email);
    }
  } catch (error) {
    console.error("Error in fetchUserData:", error);
  }
  
  return null;
};
