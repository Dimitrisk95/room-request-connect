
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/context/auth/types";

/**
 * Hook to handle auth-related navigation
 * Separates navigation logic from auth actions
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const navigateAfterLogin = useCallback((user: User | null) => {
    if (!user) return;

    if (user.role === "guest") {
      window.location.href = `/guest/${user.hotelId}/${user.roomNumber}`;
    } else if (user.role === "admin" && !user.hotelId) {
      window.location.href = "/setup";
    } else {
      window.location.href = "/dashboard";
    }
    
    // Using window.location.href instead of navigate to ensure a full page refresh
    // This fixes the interactivity issue after first login
  }, []);

  const navigateAfterLogout = useCallback(() => {
    // Hard redirect to ensure clean state
    window.location.href = "/";
  }, []);

  const navigateToPasswordSetup = useCallback(() => {
    navigate("/login", { state: { showPasswordSetup: true } });
  }, [navigate]);

  return {
    navigateAfterLogin,
    navigateAfterLogout,
    navigateToPasswordSetup
  };
};
