
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  showSkip?: boolean;
  nextLabel?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  showSkip = true,
  nextLabel = "Continue"
}) => (
  <div className="flex justify-between pt-4">
    {currentStep > 0 && (
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
    )}
    {currentStep === totalSteps - 1 ? (
      <Button onClick={onNext}>{nextLabel}</Button>
    ) : (
      showSkip && <Button variant="secondary" onClick={onSkip}>Skip for now</Button>
    )}
  </div>
);
