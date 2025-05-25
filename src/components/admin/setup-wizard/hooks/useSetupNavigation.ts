
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context";

export const useSetupNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  // Debug information on mount
  useEffect(() => {
    console.log("SetupWizard initialized with user:", { 
      userId: user?.id,
      userEmail: user?.email,
      hotelId: user?.hotelId,
      currentUrl: window.location.href
    });
  }, [user]);

  // Check if hotel is created on mount and redirect if needed
  useEffect(() => {
    if (user?.hotelId) {
      console.log("Hotel detected in user data, forcing navigation to dashboard");
      const timestamp = new Date().getTime();
      
      // Use direct window.location navigation for reliability
      setTimeout(() => {
        window.location.href = `/dashboard?t=${timestamp}`;
      }, 500);
    }
  }, [user?.hotelId]);

  // Handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  // Navigate to dashboard - using direct window location for reliability
  const handleNavigate = useCallback(() => {
    console.log("Explicitly navigating to dashboard");
    
    // First try window.location.replace which doesn't add to browser history
    try {
      const timestamp = new Date().getTime();
      window.location.replace(`/dashboard?t=${timestamp}`);
    } catch (e) {
      console.error("Error with window.location.replace:", e);
      
      // Fallback to window.location.href
      const timestamp = new Date().getTime();
      window.location.href = `/dashboard?t=${timestamp}`;
    }
  }, []);

  return {
    currentStep,
    setCurrentStep,
    handleNextStep,
    navigate: handleNavigate
  };
};
