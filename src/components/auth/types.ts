
export type UserRole = "admin" | "staff" | "guest";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hotelId?: string;
  roomNumber?: string;
  can_manage_rooms?: boolean;
  can_manage_staff?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  guestSignIn: (hotelCode: string, roomCode: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}
