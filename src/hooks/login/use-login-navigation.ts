
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
      
      // Check if admin needs to create a hotel
      if (user?.role === "admin" && !user?.hotelId) {
        console.log("Admin user without hotel, redirecting to setup");
        navigate("/setup");
        return;
      }
      
      // If we have a stored location, redirect there
      if (locationState?.from) {
        navigate(locationState.from);
      } else if (user?.role === "guest" && user.roomNumber) {
        navigate(`/guest/${user.roomNumber}`);
      } else {
        // Always redirect to dashboard for admins and staff with hotels
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, needsPasswordSetup, user, navigate, locationState, location.pathname]);
  
  const navigateAfterStaffLogin = (user: User) => {
    if (locationState?.from) {
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
