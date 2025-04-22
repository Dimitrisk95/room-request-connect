
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "./types";

/** --- Supabase Helpers --- */
async function getUserByEmailAndHotel(email: string, hotelCode: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("hotel_id", hotelCode)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function validateStaffPassword(email: string, hotelCode: string, password: string) {
  // In production, passwords should be hashed and compared server-side.
  const user = await getUserByEmailAndHotel(email, hotelCode);

  if (!user) return null;

  if (user.role === "admin" && password === "admin123") return user;
  if (user.role === "staff" && password === "staff123") return user; // for demo

  // Normally use bcrypt.compare()
  return null;
}

/** --- Handlers --- */

export const createAuthHandlers = ({
  user,
  setUser,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
}) => {
  // Staff login: use hotel code + email + password
  const login = async (
    email: string,
    password: string,
    hotelCode: string
  ) => {
    if (!hotelCode) throw new Error("Hotel code required");
    const validUser = await validateStaffPassword(email, hotelCode, password);
    if (!validUser) {
      throw new Error("Invalid credentials");
    }
    setUser(validUser);
    localStorage.setItem("user", JSON.stringify(validUser));
  };

  // Guest login uses hotelCode and roomCode only
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

  // Logout: remove user from memory/localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Create Staff Account using Supabase ("admin" only)
  const createStaffAccount = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = "staff",
    hotelId?: string
  ) => {
    // For admin registration during initial setup, use a default hotel ID if none provided
    // This is required because the users table has a hotel_id field that can't be null
    let insertHotelId = hotelId;
    
    if (!insertHotelId) {
      // Create a default hotel ID for the first admin
      // In a real app, you would create a hotel first
      insertHotelId = "550e8400-e29b-41d4-a716-446655440000";
    }

    // We need to enable the API key to bypass RLS for this specific operation
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    // Insert the user using RPC function instead of direct table insert
    // This will bypass RLS policies
    // Fix the TypeScript error by explicitly typing the parameters object
    const { data: userData, error: userError } = await supabase.rpc('create_new_user', {
      user_name: name,
      user_email: email,
      user_password: password, 
      user_role: role as string,  // Cast to string to match the expected type
      user_hotel_id: insertHotelId
    } as {  // Explicitly type the parameters object
      user_name: string;
      user_email: string;
      user_password: string;
      user_role: string;
      user_hotel_id: string;
    });

    if (userError) throw userError;
    
    return userData;
  };

  return {
    login,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};

// --- The generateCode helper is no longer needed since we removed the signup code feature ---
