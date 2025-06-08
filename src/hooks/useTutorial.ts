
import { useState, useEffect } from "react";

export const useTutorial = () => {
  const [viewedTutorials, setViewedTutorials] = useState<string[]>([]);

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
  };

  const hasTutorialBeenViewed = (tutorialId: string) => {
    return viewedTutorials.includes(tutorialId);
  };

  const resetTutorials = () => {
    setViewedTutorials([]);
    localStorage.removeItem("viewedTutorials");
  };

  return {
    markTutorialAsViewed,
    hasTutorialBeenViewed,
    resetTutorials
  };
};
