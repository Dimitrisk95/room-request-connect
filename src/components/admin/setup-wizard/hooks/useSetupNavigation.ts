
import { useState, useCallback } from "react";

export const useSetupNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  // Simple direct navigation to dashboard
  const handleNavigate = useCallback(() => {
    console.log("Direct navigation to dashboard");
    // Force navigation without any complex logic
    window.location.replace('/dashboard');
  }, []);

  return {
    currentStep,
    setCurrentStep,
    handleNextStep,
    navigate: handleNavigate
  };
};
