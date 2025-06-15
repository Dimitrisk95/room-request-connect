
import { UserRole } from "@/context/auth/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for handling user registration and account creation
 */
export const useAuthRegistration = () => {
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

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
          data: {
            name,
            role,
            hotel_id: hotelId || null
          }
        }
      });

      if (authError) {
        console.error("Auth signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      console.log("Auth user created:", authData.user.id);

      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
          role,
          hotel_id: hotelId || null,
          password_hash: 'handled_by_auth', // Placeholder since auth handles password
          needs_password_setup: false,
          email_verified: false
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't throw here, user is created in auth, profile creation is secondary
      }
      
      console.log("Staff account created successfully");
      return authData.user;
      
    } catch (error) {
      console.error("Account creation error:", error);
      throw error;
    }
  };

  return {
    createStaffAccount
  };
};
