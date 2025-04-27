
import { Button } from "@/components/ui/button";
import { SetupData } from "../SetupWizard";
import { Check, Hotel, Bed, Users } from "lucide-react";

interface CompletionStepProps {
  setupData: SetupData;
  onComplete: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ setupData, onComplete }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center">
        <Check className="h-8 w-8" />
      </div>
      
      <h2 className="text-2xl font-bold">Setup Complete!</h2>
      
      <p className="text-muted-foreground">
        Your hotel is now set up and ready to use. You can manage all aspects of your hotel from the dashboard.
      </p>
      
      <div className="bg-muted/30 rounded-lg p-6 space-y-4 text-left">
        <h3 className="font-semibold text-lg">Setup Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Hotel className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Hotel Information</div>
              <div className="text-sm text-muted-foreground">
                {setupData.hotel.name}
                {setupData.hotel.address && <span> • {setupData.hotel.address}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Bed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Rooms</div>
              <div className="text-sm text-muted-foreground">
                {setupData.rooms.createdRooms > 0 ? 
                  `${setupData.rooms.createdRooms} room${setupData.rooms.createdRooms === 1 ? '' : 's'} added` : 
                  'No rooms added yet'
                }
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Staff</div>
              <div className="text-sm text-muted-foreground">
                {setupData.staff.createdStaff > 0 ? 
                  `${setupData.staff.createdStaff} staff member${setupData.staff.createdStaff === 1 ? '' : 's'} added` : 
                  'No staff members added yet'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button onClick={onComplete} size="lg" className="px-8">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
