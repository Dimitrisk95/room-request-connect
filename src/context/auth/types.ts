
export type UserRole = "admin" | "staff" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hotelId?: string;
  roomNumber?: string;
  // Permission flags
  can_manage_rooms?: boolean;
  can_manage_staff?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, hotelCode: string) => Promise<User>; // Updated return type
  loginAsGuest: (hotelCode: string, roomCode: string) => Promise<User>; // Updated return type
  logout: () => Promise<void>;
  createStaffAccount: (name: string, email: string, password: string, role?: UserRole, hotelId?: string) => Promise<any>;
  updateUser: (updatedUser: User) => void; // Added this line
}
