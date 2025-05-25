
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
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Start countdown for auto-redirect after hotel is created
  useEffect(() => {
    // Skip countdown if in debug mode
    if (debugMode) {
      console.log("Debug mode enabled - skipping redirect countdown");
      return;
    }
    
    if (hotelCreated && !isLoading) {
      console.log("RedirectHandler: Hotel already created, starting countdown for redirect");
      setRedirectCountdown(5);
      
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            console.log("RedirectHandler: Countdown finished, triggering redirect");
            setRedirectAttempted(true);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [hotelCreated, isLoading, onComplete, debugMode]);
  
  // Fallback redirect if the countdown completes but we're still on this page
  useEffect(() => {
    if (redirectAttempted && redirectCountdown === 0 && !debugMode) {
      const fallbackTimer = setTimeout(() => {
        console.log("Fallback redirect triggered");
        window.location.href = `/dashboard?t=${new Date().getTime()}`;
      }, 2000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [redirectAttempted, redirectCountdown, debugMode]);

  return (
    <>
      {(hotelCreated && redirectCountdown !== null && redirectCountdown > 0 && !debugMode) && (
        <p className="text-xs text-center mt-2 text-muted-foreground">
          Redirecting to dashboard in {redirectCountdown} seconds...
        </p>
      )}
      
      {(hotelCreated && redirectAttempted && !debugMode) && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            If you are not redirected automatically, please click the button below to go to your dashboard.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
