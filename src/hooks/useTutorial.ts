
import { useState, useEffect } from "react";

export const useTutorial = () => {
  const [viewedTutorials, setViewedTutorials] = useState<string[]>([]);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("viewedTutorials");
    if (stored) {
      setViewedTutorials(JSON.parse(stored));
    }
  }, []);

  const markTutorialAsViewed = (tutorialId: string) => {
    const updated = [...viewedTutorials, tutorialId];
    setViewedTutorials(updated);
    localStorage.setItem("viewedTutorials", JSON.stringify(updated));
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const hasTutorialBeenViewed = (tutorialId: string) => {
    return viewedTutorials.includes(tutorialId);
  };

  const startTutorial = (tutorialId: string) => {
    if (!hasTutorialBeenViewed(tutorialId)) {
      setActiveTutorial(tutorialId);
      setCurrentStep(0);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const skipTutorial = () => {
    if (activeTutorial) {
      markTutorialAsViewed(activeTutorial);
    }
  };

  const resetTutorials = () => {
    setViewedTutorials([]);
    localStorage.removeItem("viewedTutorials");
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  return {
    markTutorialAsViewed,
    hasTutorialBeenViewed,
    startTutorial,
    activeTutorial,
    currentStep,
    nextStep,
    skipTutorial,
    resetTutorials
  };
};
