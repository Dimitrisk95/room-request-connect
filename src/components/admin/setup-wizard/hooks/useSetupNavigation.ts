
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

  // Check if hotel is already created and redirect if needed
  useEffect(() => {
    if (user?.hotelId) {
      console.log("Hotel detected in user data, redirecting to dashboard");
      window.location.href = `/dashboard`;
    }
  }, [user?.hotelId]);

  // Handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  // Navigate to dashboard
  const handleNavigate = useCallback(() => {
    console.log("Navigating to dashboard");
    window.location.href = `/dashboard`;
  }, []);

  return {
    currentStep,
    setCurrentStep,
    handleNextStep,
    navigate: handleNavigate
  };
};
