
export type UserRole = "admin" | "staff" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId?: string;
  roomNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole, hotelId?: string) => Promise<void>;
  loginWithGoogle: (signupCode: string) => Promise<void>;
  loginAsGuest: (roomCode: string, roomNumber: string) => Promise<void>;
  logout: () => void;
  createStaffAccount: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  signupCode: string;
  generateNewSignupCode: () => void;
}
