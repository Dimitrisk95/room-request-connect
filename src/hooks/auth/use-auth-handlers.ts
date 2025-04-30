
import { User, UserRole } from "@/context/auth/types";
import { useAuthLogin } from "./use-auth-login";
import { useAuthLogout } from "./use-auth-logout";
import { useAuthRegistration } from "./use-auth-registration";

interface AuthHandlersOptions {
  updateUser: (user: User) => void;
  clearUser: () => void;
}

/**
 * Custom hook to create authentication action handlers
 * Combines specialized auth hooks into a unified interface
 */
export const useAuthHandlers = ({ updateUser, clearUser }: AuthHandlersOptions) => {
  const { login, loginAsGuest } = useAuthLogin({ updateUser });
  const { logout } = useAuthLogout({ clearUser });
  const { createStaffAccount } = useAuthRegistration();

  return {
    login,
    loginAsGuest,
    logout,
    createStaffAccount
  };
};
