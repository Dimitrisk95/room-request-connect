import { useEffect, useState } from "react";
import { Check, ChevronRight, ArrowRight, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SetupData } from "../SetupWizard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CompletionStepProps {
  setupData: SetupData;
  onComplete: () => void;
  isLoading: boolean;
  hotelCreated: boolean;
  debugMode?: boolean;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ 
  setupData,
  onComplete,
  isLoading,
  hotelCreated,
  debugMode = false
}) => {
  const skippedRooms = !setupData.rooms.addRooms || setupData.rooms.createdRooms === 0;
  const skippedStaff = !setupData.staff.addStaff || setupData.staff.createdStaff === 0;
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  // Debug log to check the completion step is rendering with correct data
  useEffect(() => {
    console.log("CompletionStep rendered with:", {
      hotelName: setupData.hotel.name,
      roomsAdded: setupData.rooms.createdRooms,
      staffAdded: setupData.staff.createdStaff,
      hotelCreated,
      isLoading,
      redirectCountdown,
      redirectAttempted,
      debugMode
    });
  }, [setupData, hotelCreated, isLoading, redirectCountdown, redirectAttempted, debugMode]);
  
  // Start countdown for auto-redirect after hotel is created
  useEffect(() => {
    // Skip countdown if in debug mode
    if (debugMode) {
      console.log("Debug mode enabled - skipping redirect countdown");
      return;
    }
    
    if (hotelCreated && !isLoading) {
      console.log("CompletionStep: Hotel already created, starting countdown for redirect");
      setRedirectCountdown(5); // Increased to 5 for better visibility
      
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            console.log("CompletionStep: Countdown finished, triggering redirect");
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
  
  // Force manual dashboard navigation
  const handleManualDashboardNavigation = () => {
    console.log("Manual dashboard navigation triggered");
    setRedirectAttempted(true);
    window.location.href = `/dashboard?t=${new Date().getTime()}`;
  };
  
  const handleDashboardClick = () => {
    console.log("Dashboard button clicked, triggering onComplete with hotel created status:", hotelCreated);
    
    if (isLoading) {
      console.log("Still loading, not triggering redirect");
      return;
    }
    
    if (!hotelCreated && !debugMode) {
      console.log("Hotel not created yet, creating hotel first");
    } else {
      console.log("Hotel already created or debug mode enabled, redirecting directly");
    }
    
    // Force immediate redirection
    setRedirectCountdown(0);
    setRedirectAttempted(true);
    onComplete();
  };
  
  return (
    <div className="space-y-6">
      {debugMode && (
        <Alert variant="destructive" className="mb-6">
          <Bug className="h-4 w-4" />
          <AlertTitle>Debug Mode Active</AlertTitle>
          <AlertDescription>
            You are in debug mode. Hotel creation is simulated and no data is saved to the database.
            You can safely test the navigation behavior.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Setup Complete!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {debugMode 
            ? "Debug mode: Create hotel simulation. Click buttons below to test redirect."
            : hotelCreated 
              ? "Your hotel has been set up successfully. You will be redirected to your dashboard automatically."
              : "Review your information and click the button below to complete setup and create your hotel."}
        </p>
      </div>

      <div className="border rounded-md p-6 space-y-4 bg-card">
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded-full mt-1 ${hotelCreated || debugMode ? "bg-green-500/20" : "bg-amber-500/20"}`}>
            {hotelCreated || debugMode ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-amber-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium">Hotel Information</h3>
            <p className="text-sm text-muted-foreground">
              {debugMode 
                ? `Debug mode: ${setupData.hotel.name} (simulated hotel creation)`
                : hotelCreated 
                  ? `${setupData.hotel.name} has been created successfully.` 
                  : `${setupData.hotel.name} will be created when you complete the setup.`}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded-full mt-1 ${skippedRooms ? "bg-amber-500/20" : "bg-green-500/20"}`}>
            {skippedRooms ? (
              <ChevronRight className="h-4 w-4 text-amber-600" />
            ) : (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium">Room Management</h3>
            {skippedRooms ? (
              <div>
                <p className="text-sm text-muted-foreground">
                  You skipped this step. Add rooms from your dashboard.
                </p>
                {hotelCreated && (
                  <Link 
                    to="/rooms" 
                    className="text-sm text-primary hover:underline inline-flex items-center mt-1"
                  >
                    Go to Room Management
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {setupData.rooms.createdRooms} rooms have been added to your hotel.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded-full mt-1 ${skippedStaff ? "bg-amber-500/20" : "bg-green-500/20"}`}>
            {skippedStaff ? (
              <ChevronRight className="h-4 w-4 text-amber-600" />
            ) : (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium">Staff Management</h3>
            {skippedStaff ? (
              <div>
                <p className="text-sm text-muted-foreground">
                  You skipped this step. Add staff from your dashboard.
                </p>
                {hotelCreated && (
                  <Link 
                    to="/staff-management" 
                    className="text-sm text-primary hover:underline inline-flex items-center mt-1"
                  >
                    Go to Staff Management
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {setupData.staff.createdStaff} staff members have been added to your hotel.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clearer navigation options */}
      <div className="border rounded-md p-6 bg-card">
        <h3 className="font-medium mb-2">Navigation Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Go to Dashboard</span>
            <Button 
              variant="default"
              onClick={handleDashboardClick} 
              disabled={isLoading && !debugMode}
            >
              {isLoading && !debugMode ? 'Processing...' : 'Dashboard'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Force Hard Navigation</span>
            <Button 
              variant="secondary" 
              onClick={handleManualDashboardNavigation} 
            >
              Direct URL Navigation
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Current Location</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {window.location.href}
            </span>
          </div>
        </div>
      </div>

      {/* Added alert for manual navigation if redirection fails */}
      {(hotelCreated && redirectAttempted && !debugMode) && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            If you are not redirected automatically, please click the button below to go to your dashboard.
          </AlertDescription>
        </Alert>
      )}

      <div className="pt-4 space-y-4">
        <Button 
          onClick={handleDashboardClick} 
          className="w-full"
          disabled={isLoading && !debugMode}
        >
          {isLoading && !debugMode 
            ? 'Processing...' 
            : (hotelCreated || debugMode 
              ? 'Go to Dashboard Now' 
              : 'Complete Setup and Create Hotel'
            )
          }
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        
        {/* Always show manual navigation button if hotel is created or in debug mode */}
        {(hotelCreated || debugMode) && (
          <Button 
            variant="outline" 
            onClick={handleManualDashboardNavigation} 
            className="w-full mt-2"
          >
            Manual Dashboard Navigation
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
        
        {(hotelCreated && redirectCountdown !== null && redirectCountdown > 0 && !debugMode) && (
          <p className="text-xs text-center mt-2 text-muted-foreground">
            Redirecting to dashboard in {redirectCountdown} seconds...
          </p>
        )}
        
        {(isLoading && !debugMode) && (
          <p className="text-xs text-center mt-2 text-amber-500">
            Please wait while we set up your hotel...
          </p>
        )}
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        You can complete any skipped steps later from your dashboard.
      </p>
    </div>
  );
};

export default CompletionStep;
