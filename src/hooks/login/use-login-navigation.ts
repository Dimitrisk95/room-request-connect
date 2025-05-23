
import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/context/auth/types";

export const useLoginNavigation = (user: User | null, isAuthenticated: boolean, needsPasswordSetup: boolean) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const locationState = location.state as { from?: string, showPasswordSetup?: boolean, email?: string } | null;
  const isNewAdmin = searchParams.get('newAdmin') === 'true';
  
  // Handle new admin welcome message
  useEffect(() => {
    if (isNewAdmin) {
      toast({
        title: "Welcome to Hotel Connect!",
        description: "Please log in to set up your hotel.",
      });
    }
  }, [isNewAdmin, toast]);

  // Handle automatic redirects based on authentication
  useEffect(() => {
    if (isAuthenticated && !needsPasswordSetup) {
      console.log("User authenticated, redirecting with permissions:", {
        role: user?.role,
        can_manage_rooms: user?.can_manage_rooms,
        can_manage_staff: user?.can_manage_staff,
        hotelId: user?.hotelId
      });
      
      // If we're already on the setup page and the admin doesn't have a hotel, stay there
      const isOnSetupPage = location.pathname === "/setup";
      if (user?.role === "admin" && !user?.hotelId && !isOnSetupPage) {
        navigate("/setup");
        return;
      }
      
      // If we have a stored location, redirect there
      if (locationState?.from) {
        navigate(locationState.from);
      } else if (user?.role === "guest" && user.roomNumber) {
        navigate(`/guest/${user.roomNumber}`);
      } else if (user?.role === "admin" && !user?.hotelId && !isOnSetupPage) {
        // Redirect to setup wizard when admin has no hotel
        navigate("/setup");
      } else if (user?.hotelId) {
        // Only navigate to dashboard if they have a hotel
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, needsPasswordSetup, user, navigate, locationState, location.pathname]);
  
  const navigateAfterStaffLogin = (user: User) => {
    if (user.role === "admin" && !user.hotelId) {
      navigate("/setup");
    } else if (locationState?.from) {
      navigate(locationState.from);
    } else {
      navigate("/dashboard");
    }
  };
  
  const navigateAfterGuestLogin = (hotelCode: string, roomCode: string) => {
    navigate(`/guest/${roomCode}`);
  };

  return {
    locationState,
    navigateAfterStaffLogin,
    navigateAfterGuestLogin,
  };
};
