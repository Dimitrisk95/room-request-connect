
import { supabase } from "@/integrations/supabase/client";

interface LogoutOptions {
  clearUser: () => void;
}

/**
 * Hook for handling logout operations
 */
export const useAuthLogout = ({ clearUser }: LogoutOptions) => {
  // Logout using Supabase method
  const logout = async () => {
    try {
      // First clear the local user state to make UI respond quickly
      clearUser();
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      // Return true to indicate successful logout
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    logout
  };
};
