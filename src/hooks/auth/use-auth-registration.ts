
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
      console.log("Creating staff account for:", email, role, "with password:", password);

      // First check if user already exists in auth system
      const { data: existingAuthUser } = await supabase.auth.admin.getUserByEmail(email);
      
      if (existingAuthUser) {
        throw new Error("A user with this email already exists. Please use a different email or login instead.");
      }

      // Try to sign up the user with Supabase Auth
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
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing user:", checkError);
      }
        
      // If user already exists in our users table, update their information instead
      if (existingUser) {
        console.log("User exists in users table, updating entry.");
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name,
            role,
            hotel_id: hotelId || null,
            password_hash: password,
            needs_password_setup: false
          })
          .eq('email', email);
          
        if (updateError) {
          console.error("Error updating existing user:", updateError);
          throw updateError;
        }
      } else {
        // Insert new user details into users table
        const { data: insertedUser, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name,
            email,
            role,
            hotel_id: hotelId || null,
            password_hash: password,
            needs_password_setup: false
          })
          .select()
          .single();

        if (userError) {
          console.error("User data insert error:", userError);
          throw userError;
        }

        console.log("User successfully created in users table:", insertedUser);
      }
      
      // Success message - don't send email in this simplified version
      console.log("Staff account created successfully with password:", password);
      
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
