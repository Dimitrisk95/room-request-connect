
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetupData } from "../SetupWizard";
import { 
  DebugModeAlert, 
  CompletionHeader, 
  SetupSummary, 
  NavigationOptions, 
  RedirectHandler 
} from "./completion";

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
  // Debug log to check the completion step is rendering with correct data
  useEffect(() => {
    console.log("CompletionStep rendered with:", {
      hotelName: setupData.hotel.name,
      roomsAdded: setupData.rooms.createdRooms,
      staffAdded: setupData.staff.createdStaff,
      hotelCreated,
      isLoading,
      debugMode
    });
  }, [setupData, hotelCreated, isLoading, debugMode]);
  
  // Force manual dashboard navigation
  const handleManualDashboardNavigation = () => {
    console.log("Manual dashboard navigation triggered");
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
    
    onComplete();
  };
  
  return (
    <div className="space-y-6">
      <DebugModeAlert debugMode={debugMode} />
      
      <CompletionHeader debugMode={debugMode} hotelCreated={hotelCreated} />

      <SetupSummary 
        setupData={setupData} 
        hotelCreated={hotelCreated} 
        debugMode={debugMode} 
      />

      <NavigationOptions 
        onDashboardClick={handleDashboardClick}
        onManualNavigation={handleManualDashboardNavigation}
      />

      <RedirectHandler 
        hotelCreated={hotelCreated}
        isLoading={isLoading}
        debugMode={debugMode}
        onComplete={onComplete}
      />

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
