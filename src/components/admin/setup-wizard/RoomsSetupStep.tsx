import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RoomAddDialog from "@/components/admin/RoomAddDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { SetupData } from "../SetupWizard";
import { Bed, Plus, Check } from "lucide-react";

interface RoomsSetupStepProps {
  roomsData: SetupData["rooms"];
  updateRoomsData: (data: Partial<SetupData["rooms"]>) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const RoomsSetupStep: React.FC<RoomsSetupStepProps> = ({
  roomsData,
  updateRoomsData,
  onNext,
  onSkip,
  onBack
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdRooms, setCreatedRooms] = useState(roomsData.createdRooms);

  const handleRoomsAdded = (count: number) => {
    setCreatedRooms(prev => prev + count);
    updateRoomsData({ 
      addRooms: true,
      createdRooms: createdRooms + count
    });
    toast({
      title: "Rooms added successfully",
      description: `${count} room${count === 1 ? '' : 's'} have been added to your hotel.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-primary">
        <Bed className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Add Rooms</h2>
      </div>
      
      <p className="text-muted-foreground">
        Now, let's add rooms to your hotel. You can add multiple rooms at once or individual rooms with specific details.
        You can always add more rooms later.
      </p>

      <Card className="relative overflow-hidden border-dashed border-2 p-6">
        {createdRooms > 0 ? (
          <div className="text-center space-y-3">
            <div className="mx-auto bg-green-100 text-green-700 rounded-full w-12 h-12 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">
              {createdRooms} {createdRooms === 1 ? 'Room' : 'Rooms'} Added
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add more rooms or continue with the setup.
            </p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add More Rooms
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center">
              <Bed className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Add Rooms to Your Hotel</h3>
            <p className="text-sm text-muted-foreground">
              Add single rooms with specific details or multiple rooms at once
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rooms
            </Button>
          </div>
        )}
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        {createdRooms > 0 ? (
          <Button onClick={onNext}>Continue</Button>
        ) : (
          <Button variant="secondary" onClick={onSkip}>
            Skip for now
          </Button>
        )}
      </div>

      {user?.hotelId && (
        <RoomAddDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          onRoomsAdded={handleRoomsAdded}
        />
      )}
    </div>
  );
};

export default RoomsSetupStep;
