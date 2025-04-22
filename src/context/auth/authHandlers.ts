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
  if (["staff", "moderator"].includes(user.role) && password === "staff123") return user; // for demo

  // Normally use bcrypt.compare()
  return null;
}

/** --- Handlers --- */

export const createAuthHandlers = ({
  user,
  setUser,
  signupCode,
  setSignupCode,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
  signupCode: string;
  setSignupCode: (code: string) => void;
}) => {
  // Staff login: use hotel code + email + password, no role selection
  const login = async (
    email: string,
    password: string,
    _role: any, // no longer used
    hotelCode?: string
  ) => {
    if (!hotelCode) throw new Error("Hotel code required");
    const validUser = await validateStaffPassword(email, hotelCode, password);
    if (!validUser) {
      throw new Error("Invalid credentials");
    }
    setUser(validUser);
    localStorage.setItem("user", JSON.stringify(validUser));
  };

  // Guest login now uses hotelCode and roomCode only
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
    hotelId: string
  ) => {
    let insertHotelId = hotelId;
    if (!insertHotelId) throw new Error("Hotel ID is required");

    // Note: in real life you should hash password in backend! For now we save as plain text for demo brevity.
    const { data, error } = await supabase.from("users").insert([{
      name,
      email,
      password_hash: password, // Call this out! Use bcrypt hash in production.
      role,
      hotel_id: insertHotelId
    }]);

    if (error) throw error;
    
    // Fix the null check with a default return
    return data ? data[0] : null;
  };

  return {
    login,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};

// --- The generateCode helper remains as-is ---
export const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
