
import { Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SetupData } from "../types";

interface SetupSummaryProps {
  setupData: SetupData;
  hotelCreated: boolean;
  debugMode: boolean;
}

export const SetupSummary = ({ setupData, hotelCreated, debugMode }: SetupSummaryProps) => {
  const skippedRooms = !setupData.rooms.addRooms || setupData.rooms.createdRooms === 0;
  const skippedStaff = !setupData.staff.addStaff || setupData.staff.createdStaff === 0;

  return (
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
  );
};
