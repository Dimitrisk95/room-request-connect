
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // After successful login, fetch additional user details
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) throw userError;

      const userObject: User = {
        id: data.user.id,
        name: userData.name,
        email: data.user.email!,
        role: userData.role,
        hotelId: userData.hotel_id,
      };

      setUser(userObject);
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
  };

  // Logout using Supabase method
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  // Create Staff Account using Supabase authentication
  const createStaffAccount = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "staff",
    hotelId?: string
  ) => {
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

    if (authError) throw authError;

    // Insert additional user details into users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        name,
        email,
        role,
        hotel_id: hotelId || "550e8400-e29b-41d4-a716-446655440000",
        password_hash: 'placeholder' // In production, never store plain passwords
      });

    if (userError) throw userError;

    // Return void to match the updated type
    return;
  };

  return {
    login,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};
