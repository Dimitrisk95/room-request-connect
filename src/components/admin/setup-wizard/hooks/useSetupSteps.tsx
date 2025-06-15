
import { useState } from "react";
import { Hotel, Check } from "lucide-react";

export interface SetupStep {
  id: string;
  label: string;
  icon: JSX.Element;
  required: boolean;
}

export function useSetupSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: SetupStep[] = [
    {
      id: "hotel",
      label: "Hotel Information",
      icon: <Hotel className="h-5 w-5" />,
      required: true,
    },
    {
      id: "complete",
      label: "Complete",
      icon: <Check className="h-5 w-5" />,
      required: true,
    },
  ];

  const nextStep = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  };

  return { currentStep, setCurrentStep, steps, nextStep, prevStep };
}
