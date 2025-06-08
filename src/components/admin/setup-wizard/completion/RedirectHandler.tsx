
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RedirectHandlerProps {
  hotelCreated: boolean;
  isLoading: boolean;
  debugMode: boolean;
  onComplete: () => void;
}

export const RedirectHandler = ({ hotelCreated, isLoading, debugMode, onComplete }: RedirectHandlerProps) => {
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Start countdown for auto-redirect after hotel is created
  useEffect(() => {
    // Skip countdown if in debug mode
    if (debugMode) {
      console.log("Debug mode enabled - skipping redirect countdown");
      return;
    }
    
    if (hotelCreated && !isLoading) {
      console.log("Hotel created successfully, starting redirect countdown");
      setRedirectCountdown(3);
      
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            console.log("Redirect countdown finished, navigating to dashboard");
            window.location.href = `/dashboard`;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [hotelCreated, isLoading, debugMode]);

  return (
    <>
      {(hotelCreated && redirectCountdown !== null && redirectCountdown > 0 && !debugMode) && (
        <p className="text-xs text-center mt-2 text-muted-foreground">
          Redirecting to dashboard in {redirectCountdown} seconds...
        </p>
      )}
      
      {(hotelCreated && !debugMode) && (
        <Alert className="bg-green-50 border-green-200 mt-4">
          <AlertDescription className="text-green-800">
            Hotel setup completed successfully! You will be redirected to your dashboard shortly.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
