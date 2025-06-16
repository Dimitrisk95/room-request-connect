
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
        description: "Please log in to access your dashboard.",
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
      
      // Handle guest users
      if (user.role === "guest" && user.roomNumber) {
        navigate(`/guest/${user.roomNumber}`);
        return;
      }
      
      // For admin users, always go to admin dashboard (hotel is auto-created)
      if (user.role === "admin") {
        navigate("/admin-dashboard");
        return;
      }
      
      // If we have a stored location, redirect there
      if (locationState?.from) {
        navigate(locationState.from);
        return;
      }
      
      // Default redirect to dashboard for authenticated users
      navigate("/dashboard");
    }
  }, [isAuthenticated, needsPasswordSetup, user, navigate, locationState]);
  
  const navigateAfterStaffLogin = (user: User) => {
    // For admin users, go to admin dashboard
    if (user.role === "admin") {
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
