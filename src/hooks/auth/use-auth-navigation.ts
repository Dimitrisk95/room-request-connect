
import { useNavigate } from "react-router-dom";

/**
 * Hook for handling authentication-related navigation
 * Only use this hook inside components that are rendered within a Router
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();
  
  // Navigate based on user role after login
  const navigateAfterLogin = (role: string, roomNumber?: string) => {
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
