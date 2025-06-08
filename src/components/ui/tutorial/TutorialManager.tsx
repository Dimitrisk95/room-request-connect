
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTutorial } from "@/hooks/useTutorial";
import { SpotlightTutorial } from "@/components/tutorials/SpotlightTutorial";
import { getTutorialSteps } from "@/components/tutorials/TutorialContent";

interface TutorialManagerProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    dataTour?: string;
    tutorialId?: string;
  }>;
}

const TutorialManager: React.FC<TutorialManagerProps> = ({ navigation }) => {
  const { pathname } = useLocation();
  const { 
    startTutorial, 
    hasTutorialBeenViewed, 
    activeTutorial, 
    currentStep, 
    nextStep, 
    skipTutorial, 
    markTutorialAsViewed 
  } = useTutorial();

  // Check for tutorial on route change
  useEffect(() => {
    const navItem = navigation.find(item => item.href === pathname);
    
    if (navItem?.tutorialId && !hasTutorialBeenViewed(navItem.tutorialId)) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        startTutorial(navItem.tutorialId);
      }, 500);
    }
  }, [pathname, navigation, hasTutorialBeenViewed, startTutorial]);

  const handleTutorialComplete = () => {
    if (activeTutorial) {
      markTutorialAsViewed(activeTutorial);
    }
  };

  // Clean up highlight attributes when tutorial ends
  useEffect(() => {
    if (!activeTutorial) {
      const highlightedElements = document.querySelectorAll('[data-tutorial-highlight]');
      highlightedElements.forEach(el => {
        el.removeAttribute('data-tutorial-highlight');
      });
    }
  }, [activeTutorial]);

  const currentTutorialSteps = activeTutorial ? getTutorialSteps(activeTutorial) : [];

  return (
    <SpotlightTutorial
      isActive={!!activeTutorial}
      steps={currentTutorialSteps}
      currentStep={currentStep}
      onNext={nextStep}
      onSkip={skipTutorial}
      onComplete={handleTutorialComplete}
    />
  );
};

export default TutorialManager;
