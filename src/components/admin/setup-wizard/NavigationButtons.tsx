
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  skipToCompletion?: () => void;
  showSkip?: boolean;
  showSkipAll?: boolean;
  nextLabel?: string;
  skipLabel?: string;
  isLastStep?: boolean;
  isLoading?: boolean;
}

const NavigationButtons = ({
  onBack,
  onNext,
  onSkip,
  skipToCompletion,
  showSkip = false,
  showSkipAll = false,
  nextLabel = "Next",
  skipLabel = "Skip",
  isLastStep = false,
  isLoading = false
}: NavigationButtonsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      
      <div className="flex-grow" />
      
      {showSkip && onSkip && (
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          disabled={isLoading}
        >
          {skipLabel}
        </Button>
      )}

      {showSkipAll && skipToCompletion && (
        <Button
          type="button"
          variant="ghost"
          onClick={skipToCompletion}
          disabled={isLoading}
        >
          Skip to Finish
        </Button>
      )}
      
      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
