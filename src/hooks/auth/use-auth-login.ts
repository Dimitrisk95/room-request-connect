
import { User } from "@/context/auth/types";
import { supabase } from "@/integrations/supabase/client";

interface LoginOptions {
  updateUser: (user: User) => void;
}

/**
 * Hook for handling login operations
 */
export const useAuthLogin = ({ updateUser }: LoginOptions) => {
  // Staff login using Supabase authentication
  const login = async (
    email: string,
    password: string,
    hotelCode?: string
  ) => {
    console.log("Attempting login with:", { email });
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }

    // After successful login, fetch additional user details
    if (data.user) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (userError) {
          console.error("Error fetching user data:", userError);
          throw userError;
        }
        
        // If no user found in the users table, throw a specific error
        if (!userData) {
          console.error("User exists in auth but not in users table:", email);
          throw new Error("User profile not found. Please contact support.");
        }

        // Ensure we correctly capture and pass the permission flags
        const userObject: User = {
          id: data.user.id,
          name: userData.name,
          email: data.user.email!,
          role: userData.role,
          hotelId: userData.hotel_id,
          // Include permission flags
          can_manage_rooms: userData.can_manage_rooms || false,
          can_manage_staff: userData.can_manage_staff || false
        };

        console.log("User logged in with permissions:", {
          id: userObject.id,
          email: userObject.email,
          role: userObject.role,
          can_manage_rooms: userObject.can_manage_rooms,
          can_manage_staff: userObject.can_manage_staff
        });

        updateUser(userObject);
        return userObject;
      } catch (err) {
        console.error("Error fetching user data:", err);
        throw err;
      }
    } else {
      // Ensure we handle the case where data.user is undefined
      throw new Error("Login failed. No user data returned.");
    }
  };

  // Guest login
  const loginAsGuest = async (hotelCode: string, roomCode: string) => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: "Guest User",
      email: `guest-${hotelCode}-${roomCode}@example.com`,
      role: "guest" as const,
      hotelId: hotelCode,
      roomNumber: roomCode,
    };
    updateUser(guestUser);
    return guestUser;
  };

  return {
    login,
    loginAsGuest
  };
};
