
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

    if (!data.user) {
      throw new Error("Login failed. No user data returned.");
    }

    // After successful login, fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      
      // If user doesn't exist in our users table, create a basic profile
      if (userError.code === 'PGRST116') {
        console.log("Creating user profile for authenticated user");
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email!,
            role: 'admin',
            password_hash: 'handled_by_auth',
            needs_password_setup: false,
            email_verified: data.user.email_confirmed_at != null
          });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          throw new Error("Failed to create user profile");
        }

        // Fetch the newly created profile
        const { data: newUserData, error: newUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (newUserError) {
          throw newUserError;
        }

        userData = newUserData;
      } else {
        throw userError;
      }
    }

    const userObject: User = {
      id: data.user.id,
      name: userData.name,
      email: data.user.email!,
      role: userData.role,
      hotelId: userData.hotel_id,
      can_manage_rooms: userData.can_manage_rooms || false,
      can_manage_staff: userData.can_manage_staff || false
    };

    console.log("User logged in successfully:", {
      id: userObject.id,
      email: userObject.email,
      role: userObject.role,
      hotelId: userObject.hotelId
    });

    updateUser(userObject);
    return userObject;
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
