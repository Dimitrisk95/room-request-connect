
import { User } from "@/context/auth/types";
import { Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

export interface AuthStateActions {
  updateAuthState: (newState: Partial<AuthState>) => void;
  updateUser: (updatedUser: User) => void;
}
