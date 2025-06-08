
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetupData } from "../SetupWizard";
import { 
  DebugModeAlert, 
  CompletionHeader, 
  SetupSummary, 
  NavigationOptions 
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
  
  // Simple manual navigation
  const handleManualDashboardNavigation = () => {
    console.log("Manual dashboard navigation triggered");
    window.location.replace('/dashboard');
  };
  
  const handleDashboardClick = () => {
    console.log("Dashboard button clicked");
    
    if (isLoading) {
      console.log("Still loading, ignoring click");
      return;
    }
    
    if (debugMode) {
      console.log("Debug mode enabled, redirecting directly");
      handleManualDashboardNavigation();
      return;
    }
    
    console.log("Triggering onComplete");
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

      <div className="pt-4 space-y-4">
        <Button 
          onClick={handleDashboardClick} 
          className="w-full"
          disabled={isLoading && !debugMode}
        >
          {isLoading && !debugMode 
            ? 'Creating Hotel...' 
            : (hotelCreated || debugMode 
              ? 'Go to Dashboard' 
              : 'Complete Setup and Create Hotel'
            )
          }
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleManualDashboardNavigation} 
          className="w-full"
          disabled={isLoading && !debugMode}
        >
          Force Dashboard Navigation
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        
        {(isLoading && !debugMode) && (
          <p className="text-xs text-center mt-2 text-amber-600">
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
