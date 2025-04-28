
import { User, UserRole } from "@/context/auth/types";
import { supabase } from "@/integrations/supabase/client";

interface AuthHandlersOptions {
  updateUser: (user: User) => void;
  clearUser: () => void;
}

/**
 * Custom hook to create authentication action handlers
 * Separates auth actions from auth state management
 */
export const useAuthHandlers = ({ updateUser, clearUser }: AuthHandlersOptions) => {
  // Staff login using Supabase authentication
  const login = async (
    email: string,
    password: string,
    hotelCode?: string
  ) => {
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

  // Guest login remains similar
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

  // Logout using Supabase method
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      clearUser();
      // Redirect will be handled by the component using this hook
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Create Staff Account using Supabase authentication
  const createStaffAccount = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    try {
      console.log("Creating staff account for:", email, role);

      // First try to sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            hotel_id: hotelId || null
          }
        }
      });

      if (authError) {
        // Special handling for "User already registered" error
        if (authError.message.includes("User already registered")) {
          throw new Error("A user with this email already exists. Please use a different email or login instead.");
        }
        
        console.error("Auth signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      console.log("Auth user created:", authData.user.id);

      // Check if the user already exists in our custom users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      // If user already exists in our users table, delete the old entry
      if (existingUser) {
        console.log("User exists in users table, updating entry.");
        await supabase
          .from('users')
          .delete()
          .eq('email', email);
      }

      // Insert additional user details into users table
      const { data: insertedUser, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
          role,
          hotel_id: hotelId || null,
          password_hash: 'placeholder',
          needs_password_setup: true
        })
        .select()
        .single();

      if (userError) {
        console.error("User data insert error:", userError);
        throw userError;
      }

      console.log("User successfully created in users table:", insertedUser);
      
      // Send password setup email
      const { error: emailError } = await supabase.functions.invoke('send-password-setup', {
        body: { email, name }
      });

      if (emailError) {
        console.error("Error sending password setup email:", emailError);
        // We don't throw here as the account was created successfully
      }

      console.log("User successfully created and email sent");
      
      return authData.user;
    } catch (error) {
      console.error("Account creation error:", error);
      throw error;
    }
  };

  return {
    login,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};
