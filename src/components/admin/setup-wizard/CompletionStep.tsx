
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SetupData } from "../SetupWizard";
import { useEffect } from "react";

interface CompletionStepProps {
  setupData: SetupData;
  onComplete: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ 
  setupData,
  onComplete
}) => {
  const skippedRooms = !setupData.rooms.addRooms || setupData.rooms.createdRooms === 0;
  const skippedStaff = !setupData.staff.addStaff || setupData.staff.createdStaff === 0;
  
  // Debug log to check the completion step is rendering with correct data
  useEffect(() => {
    console.log("CompletionStep rendered with:", {
      hotelName: setupData.hotel.name,
      roomsAdded: setupData.rooms.createdRooms,
      staffAdded: setupData.staff.createdStaff
    });
  }, [setupData]);
  
  const handleDashboardClick = () => {
    console.log("Dashboard button clicked, triggering onComplete");
    onComplete();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Setup Complete!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your hotel has been set up successfully. You can now access your 
          dashboard to manage your hotel.
        </p>
      </div>

      <div className="border rounded-md p-6 space-y-4 bg-card">
        <div className="flex items-start gap-3">
          <div className="bg-green-500/20 p-1 rounded-full mt-1">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Hotel Information</h3>
            <p className="text-sm text-muted-foreground">
              {setupData.hotel.name} has been created successfully.
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
                <Link 
                  to="/rooms" 
                  className="text-sm text-primary hover:underline inline-flex items-center mt-1"
                >
                  Go to Room Management
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
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
                <Link 
                  to="/staff-management" 
                  className="text-sm text-primary hover:underline inline-flex items-center mt-1"
                >
                  Go to Staff Management
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {setupData.staff.createdStaff} staff members have been added to your hotel.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleDashboardClick} className="w-full">
          Go to Dashboard
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        You can complete any skipped steps later from your dashboard.
      </p>
    </div>
  );
};

export default CompletionStep;
