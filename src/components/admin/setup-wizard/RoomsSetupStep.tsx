
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, PlusCircle } from "lucide-react";
import NavigationButtons from "./NavigationButtons";
import { SetupData } from "../SetupWizard";

interface RoomSetupStepProps {
  roomsData: SetupData["rooms"];
  updateRoomsData: (data: Partial<SetupData["rooms"]>) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  skipToCompletion?: () => void;
}

const RoomsSetupStep: React.FC<RoomSetupStepProps> = ({
  roomsData,
  updateRoomsData,
  onNext,
  onSkip,
  onBack,
  skipToCompletion
}) => {
  const [isAddingRooms, setIsAddingRooms] = useState(roomsData.addRooms);
  
  const handleAddRooms = () => {
    setIsAddingRooms(true);
    updateRoomsData({ addRooms: true });
  };
  
  const handleSkipRooms = () => {
    setIsAddingRooms(false);
    updateRoomsData({ addRooms: false });
    onSkip();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-primary">
        <Bed className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Room Management</h2>
      </div>
      
      <p className="text-muted-foreground">
        You can add rooms to your hotel now or skip and do it later from the dashboard.
      </p>
      
      {!isAddingRooms ? (
        <Card className="p-6 text-center space-y-4">
          <Bed className="h-12 w-12 mx-auto text-primary opacity-80" />
          <h3 className="text-lg font-medium">Add Rooms to Your Hotel</h3>
          <p className="text-muted-foreground">
            Set up your rooms with numbers, types, and amenities to start 
            accepting guest requests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={handleAddRooms} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Rooms Now
            </Button>
            <Button variant="outline" onClick={handleSkipRooms}>
              Skip for Now
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground pt-2">
            You can always add and manage rooms later from your dashboard.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="border rounded-md p-6 bg-muted/30">
            <p className="text-center text-muted-foreground">
              Room management features will be available here. 
              You can add rooms later from the Dashboard → Room Management section.
            </p>
          </div>
          
          <NavigationButtons 
            onBack={onBack}
            onNext={onNext}
            skipToCompletion={skipToCompletion}
            showSkip={true}
            showSkipAll={true}
            nextLabel="Continue"
            skipLabel="Skip"
          />
        </div>
      )}
    </div>
  );
};

export default RoomsSetupStep;
