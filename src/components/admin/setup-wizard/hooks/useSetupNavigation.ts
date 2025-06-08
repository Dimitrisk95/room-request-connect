
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

  // Handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  // Simple navigation to dashboard - no complex logic
  const handleNavigate = useCallback(() => {
    console.log("Navigating to dashboard via window.location");
    // Use a timeout to ensure any pending state updates complete
    setTimeout(() => {
      window.location.href = `/dashboard`;
    }, 100);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    handleNextStep,
    navigate: handleNavigate
  };
};
