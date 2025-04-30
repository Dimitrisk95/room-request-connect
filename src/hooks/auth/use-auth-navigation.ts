
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/context/auth/types";

/**
 * Hook for handling authentication-related navigation
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();

  // Navigate based on user role after login
  const navigateAfterLogin = (role: UserRole, roomNumber?: string) => {
    if (role === "guest" && roomNumber) {
      navigate(`/guest/${roomNumber}`);
    } else {
      navigate("/dashboard");
    }
  };

  // Navigate after logout
  const navigateAfterLogout = () => {
    navigate("/");
  };

  return {
    navigateAfterLogin,
    navigateAfterLogout
  };
};
