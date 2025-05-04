
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, PlusCircle } from "lucide-react";
import NavigationButtons from "./NavigationButtons";
import { SetupData } from "../SetupWizard";
import RoomAddDialog from "../RoomAddDialog";
import { Room } from "@/types";

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
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const handleAddRooms = () => {
    setIsAddingRooms(true);
    updateRoomsData({ addRooms: true });
    setShowAddDialog(true);
  };
  
  const handleSkipRooms = () => {
    setIsAddingRooms(false);
    updateRoomsData({ addRooms: false });
    onSkip();
  };

  const handleRoomsAdded = (count: number) => {
    const totalRooms = (roomsData.createdRooms || 0) + count;
    console.log(`Added ${count} rooms, total is now ${totalRooms}`);
    updateRoomsData({ 
      addRooms: true,
      createdRooms: totalRooms 
    });
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
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {roomsData.createdRooms > 0 ? 
                  `You have added ${roomsData.createdRooms} room${roomsData.createdRooms > 1 ? 's' : ''} to your hotel.` : 
                  'No rooms have been added yet.'
                }
              </p>
              
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add More Rooms
              </Button>
            </div>
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

      {/* Room Add Dialog */}
      <RoomAddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onRoomsAdded={handleRoomsAdded}
      />
    </div>
  );
};

export default RoomsSetupStep;
