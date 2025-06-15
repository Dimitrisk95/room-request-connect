
import { useState, useEffect } from "react";
import { useAuth } from "@/context";

export const useOnboarding = () => {
  const { user } = useAuth();
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
      
      if (!hasCompletedOnboarding) {
        // Show welcome tour for new users
        const timer = setTimeout(() => {
          setShowWelcomeTour(true);
        }, 1000); // Small delay to let the dashboard load
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setShowWelcomeTour(false);
  };

  const skipOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setShowWelcomeTour(false);
  };

  return {
    showWelcomeTour,
    completeOnboarding,
    skipOnboarding
  };
};
