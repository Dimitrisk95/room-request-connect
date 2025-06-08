
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, SkipForward } from "lucide-react";

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

interface SpotlightTutorialProps {
  isActive: boolean;
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const SpotlightTutorial: React.FC<SpotlightTutorialProps> = ({
  isActive,
  steps,
  currentStep,
  onNext,
  onSkip,
  onComplete,
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive || currentStep >= steps.length) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      
      // Calculate tooltip position
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top = 0;
      let left = 0;
      
      switch (step.position) {
        case "top":
          top = rect.top + scrollTop - 120;
          left = rect.left + scrollLeft + rect.width / 2 - 150;
          break;
        case "bottom":
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft + rect.width / 2 - 150;
          break;
        case "left":
          top = rect.top + scrollTop + rect.height / 2 - 60;
          left = rect.left + scrollLeft - 320;
          break;
        case "right":
          top = rect.top + scrollTop + rect.height / 2 - 60;
          left = rect.right + scrollLeft + 10;
          break;
      }
      
      setTooltipPosition({ top, left });
      
      // Scroll element into view
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, currentStep, steps]);

  if (!isActive || currentStep >= steps.length || !targetElement) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onNext();
    } else {
      onComplete();
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none" />
      
      {/* Spotlight effect */}
      <style>
        {`
          [data-tutorial-highlight] {
            position: relative !important;
            z-index: 50 !important;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(0, 0, 0, 0.8) !important;
            border-radius: 8px !important;
          }
        `}
      </style>
      
      {/* Add highlight to target element */}
      {(() => {
        if (targetElement) {
          targetElement.setAttribute('data-tutorial-highlight', 'true');
          return null;
        }
      })()}
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-80 shadow-lg border"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-sm">{currentStepData.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {currentStepData.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onSkip}>
                <SkipForward className="h-3 w-3 mr-1" />
                Skip
              </Button>
              <Button size="sm" onClick={handleNext}>
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ArrowRight className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
