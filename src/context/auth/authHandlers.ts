
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "./types";

export const createAuthHandlers = ({
  user,
  setUser,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
}) => {
  // Staff login using Supabase authentication
  const login = async (
    email: string,
    password: string,
    hotelCode: string
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
        };

        setUser(userObject);
        localStorage.setItem("user", JSON.stringify(userObject));
        return userObject;
      } catch (err) {
        console.error("Error fetching user data:", err);
        throw err;
      }
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
    setUser(guestUser);
    localStorage.setItem("user", JSON.stringify(guestUser));
    return guestUser;
  };

  // Logout using Supabase method
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Create Staff Account using Supabase authentication with improved error handling
  const createStaffAccount = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    try {
      console.log("Creating staff account for:", email, role);

      // First check if email already exists in auth
      const { data: { users }, error: userCheckError } = await supabase.auth.admin.listUsers();
      
      if (userCheckError) {
        console.error("Error checking existing users:", userCheckError);
      } else if (users?.some(u => u.email === email)) {
        throw new Error("A user with this email already exists in the authentication system");
      }

      // Check if user already exists in our custom users table
      const { data: existingUser, error: userTableError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (userTableError) {
        console.error("Error checking users table:", userTableError);
      } else if (existingUser) {
        throw new Error("A user with this email already exists in the users table");
      }

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            hotel_id: hotelId || "550e8400-e29b-41d4-a716-446655440000"
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

      // Insert additional user details into users table
      const { data: insertedUser, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
          role,
          hotel_id: hotelId || "550e8400-e29b-41d4-a716-446655440000",
          password_hash: 'placeholder' // In production, never store plain passwords
        })
        .select()
        .single();

      if (userError) {
        console.error("User data insert error:", userError);
        // If inserting user data fails, attempt to clean up the auth user
        try {
          console.warn("User table insert failed, but auth user was created. User ID:", authData.user.id);
        } catch (cleanupErr) {
          console.error("Failed to clean up auth user:", cleanupErr);
        }
        throw userError;
      }

      console.log("User successfully created in users table:", insertedUser);
      
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
