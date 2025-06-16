
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
        title: "Welcome to Roomlix!",
        description: "Please log in to set up your hotel.",
      });
    }
  }, [isNewAdmin, toast]);

  // Handle automatic redirects based on authentication
  useEffect(() => {
    if (isAuthenticated && !needsPasswordSetup && user) {
      console.log("User authenticated, checking redirect path:", {
        role: user.role,
        hotelId: user.hotelId,
        can_manage_rooms: user.can_manage_rooms,
        can_manage_staff: user.can_manage_staff
      });
      
      // Check if admin needs to create a hotel
      if (user.role === "admin" && !user.hotelId) {
        console.log("Admin user without hotel, redirecting to setup");
        navigate("/setup");
        return;
      }
      
      // Handle guest users
      if (user.role === "guest" && user.roomNumber) {
        navigate(`/guest/${user.roomNumber}`);
        return;
      }
      
      // If we have a stored location, redirect there (but not for admins without hotels)
      if (locationState?.from && user.hotelId) {
        navigate(locationState.from);
        return;
      }
      
      // For admin users with hotels, redirect to admin dashboard
      if (user.role === "admin" && user.hotelId) {
        navigate("/admin-dashboard");
        return;
      }
      
      // Default redirect to dashboard for authenticated users with hotels
      if (user.hotelId) {
        navigate("/dashboard");
      } else if (user.role === "admin") {
        // Admin without hotel should go to setup
        navigate("/setup");
      } else {
        // Fallback to dashboard
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, needsPasswordSetup, user, navigate, locationState]);
  
  const navigateAfterStaffLogin = (user: User) => {
    // Check if admin needs hotel setup
    if (user.role === "admin" && !user.hotelId) {
      navigate("/setup");
      return;
    }
    
    // For admin users with hotels, go to admin dashboard
    if (user.role === "admin" && user.hotelId) {
      navigate("/admin-dashboard");
      return;
    }
    
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
