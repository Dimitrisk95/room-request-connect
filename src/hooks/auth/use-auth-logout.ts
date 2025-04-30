
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
      await supabase.auth.signOut();
      clearUser();
      // Redirect will be handled by the component using this hook
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    logout
  };
};
