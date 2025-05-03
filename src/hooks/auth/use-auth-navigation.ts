
/**
 * Hook for handling authentication-related navigation
 * Only use this hook inside components that are rendered within a Router
 */
export const useAuthNavigation = () => {
  // Instead of using useNavigate here, we'll return functions that the components can use
  // Components using these functions must be within Router context
  
  // Navigate based on user role after login
  const navigateAfterLogin = (role: string, roomNumber?: string) => {
    if (role === "guest" && roomNumber) {
      return `/guest/${roomNumber}`;
    } else {
      return "/dashboard";
    }
  };

  // Navigate after logout
  const navigateAfterLogout = () => {
    return "/";
  };

  return {
    navigateAfterLogin,
    navigateAfterLogout
  };
};
