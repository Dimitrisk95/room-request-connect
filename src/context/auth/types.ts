
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
  login: (email: string, password: string, hotelCode: string) => Promise<void>;
  loginAsGuest: (hotelCode: string, roomCode: string) => Promise<void>;
  logout: () => Promise<void>;
  createStaffAccount: (name: string, email: string, password: string, role?: UserRole, hotelId?: string) => Promise<any>; // Changed return type from Promise<void> to Promise<any>
}
