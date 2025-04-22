
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "./types";

/** --- Supabase Helpers --- */
async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function validatePassword(email: string, password: string) {
  // In production, passwords should be hashed and compared server-side for security. 
  // For this mock prototype, we assume password is stored as bcrypt hash.
  const user = await getUserByEmail(email);
  if (!user) return null;

  // For the demo, we “fake” password check: accept password 'admin123' for the admin,
  // 'staff123' for any staff, and bypass for others (you would hash/check on backend).
  if (user.role === "admin" && password === "admin123") return user;
  if (user.role === "staff" && password === "staff123") return user;

  // You should use bcrypt.compare() in an Edge Function for real projects!
  return null;
}
/** --- End Supabase Helpers --- */

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

  // Login with email and password using Supabase
  const login = async (email: string, password: string, role: UserRole, hotelId?: string) => {
    const validUser = await validatePassword(email, password);
    if (!validUser || validUser.role !== role) {
      throw new Error("Invalid credentials");
    }
    setUser(validUser);
    localStorage.setItem("user", JSON.stringify(validUser));
  };

  // Google login remains a stub: use as staff, linked to first hotel.
  const loginWithGoogle = async (signupCode: string) => {
    // You'd normally verify the code and Google oAuth.
    setUser({
      id: `google-user-${Date.now()}`,
      name: "Google User",
      email: "google@example.com",
      role: "staff",
      hotelId: "550e8400-e29b-41d4-a716-446655440000"
    });
  };

  // Guest login as before (doesn’t use database for mock)
  const loginAsGuest = async (roomCode: string, roomNumber: string) => {
    setUser({
      id: `guest-${Date.now()}`,
      name: "Guest User",
      email: `guest-${roomCode}@example.com`,
      role: "guest",
      roomNumber
    });
    localStorage.setItem("user", JSON.stringify({
      id: `guest-${Date.now()}`,
      name: "Guest User",
      email: `guest-${roomCode}@example.com`,
      role: "guest",
      roomNumber
    }));
  };

  // Logout: remove user from memory/localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Create Staff Account using Supabase (“admin” only)
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
    return data?.[0];
  };

  return {
    login,
    loginWithGoogle,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};

// --- The generateCode helper remains as-is ---
export const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
