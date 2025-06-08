
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Hotel, Check, Users, Bed } from "lucide-react";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HotelSetupStep from "./HotelSetupStep";
import RoomsSetupStep from "./RoomsSetupStep";
import StaffSetupStep from "./StaffSetupStep";
import { SetupData } from "./types";

interface SimpleSetupWizardProps {
  debugMode?: boolean;
}

const SimpleSetupWizard = ({ debugMode = false }: SimpleSetupWizardProps) => {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [setupData, setSetupData] = useState<SetupData>({
    hotel: {
      name: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      hotelCode: ""
    },
    rooms: {
      addRooms: false,
      createdRooms: 0,
      roomsToAdd: []
    },
    staff: {
      addStaff: false,
      createdStaff: 0,
      staffToAdd: []
    }
  });

  const steps = [
    { id: "hotel", label: "Hotel Information", icon: <Hotel className="h-5 w-5" />, required: true },
    { id: "rooms", label: "Add Rooms", icon: <Bed className="h-5 w-5" />, required: false },
    { id: "staff", label: "Add Staff", icon: <Users className="h-5 w-5" />, required: false },
    { id: "complete", label: "Complete", icon: <Check className="h-5 w-5" />, required: true },
  ];

  const updateSetupData = (data: Partial<SetupData>) => {
    setSetupData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCreateHotel = async () => {
    if (isCreating) {
      console.log("Already creating hotel, ignoring");
      return;
    }

    setIsCreating(true);
    console.log("Creating hotel with data:", setupData);

    try {
      // Insert the hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: setupData.hotel.name,
          address: setupData.hotel.address || null,
          contact_email: setupData.hotel.contactEmail || null,
          contact_phone: setupData.hotel.contactPhone || null,
          hotel_code: setupData.hotel.hotelCode || null
        })
        .select()
        .single();

      if (hotelError) {
        throw hotelError;
      }

      console.log("Hotel created successfully:", hotelData);
      const hotelId = hotelData.id;

      // Update the current user with the hotel ID
      if (user) {
        const { error: userError } = await supabase
          .from("users")
          .update({ hotel_id: hotelId })
          .eq("id", user.id);

        if (userError) {
          throw userError;
        }

        // Update the user context
        const updatedUser = { ...user, hotelId };
        updateUser(updatedUser);
        console.log("User updated with hotel ID:", hotelId);
      }

      // Add rooms if any were setup
      if (setupData.rooms.addRooms && setupData.rooms.roomsToAdd.length > 0) {
        console.log("Adding rooms:", setupData.rooms.roomsToAdd);
        
        const roomsWithHotelId = setupData.rooms.roomsToAdd.map(room => ({
          ...room,
          hotel_id: hotelId
        }));

        const { error: roomsError } = await supabase
          .from("rooms")
          .insert(roomsWithHotelId);

        if (roomsError) {
          console.error("Error adding rooms:", roomsError);
          toast.error("Some rooms could not be added. You can add them later in the dashboard.");
        }
      }

      toast.success("Hotel setup completed successfully!");
      console.log("Hotel creation completed, redirecting to dashboard");
      
      // Simple redirect after successful creation
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error("Error setting up hotel:", error);
      toast.error(`Setup failed: ${error.message || "Unknown error"}`);
      setIsCreating(false);
    }
  };

  const updateHotelData = (data: Partial<typeof setupData.hotel>) => {
    updateSetupData({ hotel: { ...setupData.hotel, ...data } });
  };

  const updateRoomsData = (data: Partial<typeof setupData.rooms>) => {
    updateSetupData({ rooms: { ...setupData.rooms, ...data } });
  };

  const updateStaffData = (data: Partial<typeof setupData.staff>) => {
    updateSetupData({ staff: { ...setupData.staff, ...data } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {debugMode && (
        <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700 font-medium">
            Debug Mode Enabled: Automatic redirects are disabled
          </p>
        </div>
      )}

      <Steps 
        steps={steps} 
        currentStep={currentStep} 
        className="mb-8"
      />

      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <HotelSetupStep 
              hotelData={setupData.hotel}
              updateHotelData={updateHotelData}
              onNext={nextStep}
              isLoading={false}
              hotelCreated={false}
            />
          )}
          
          {currentStep === 1 && (
            <RoomsSetupStep 
              roomsData={setupData.rooms}
              updateRoomsData={updateRoomsData}
              onNext={nextStep}
              onSkip={nextStep}
              onBack={prevStep}
              skipToCompletion={() => setCurrentStep(3)}
            />
          )}
          
          {currentStep === 2 && (
            <StaffSetupStep 
              staffData={setupData.staff}
              updateStaffData={updateStaffData}
              onNext={nextStep}
              onSkip={nextStep}
              onBack={prevStep}
              skipToCompletion={() => setCurrentStep(3)}
            />
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Setup Complete!</h2>
                <p className="text-muted-foreground mb-6">
                  Ready to create your hotel and start managing your property.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Setup Summary</h3>
                <ul className="text-sm space-y-1">
                  <li>Hotel Name: {setupData.hotel.name}</li>
                  <li>Hotel Code: {setupData.hotel.hotelCode}</li>
                  {setupData.rooms.addRooms && (
                    <li>Rooms to add: {setupData.rooms.roomsToAdd.length}</li>
                  )}
                  {setupData.staff.addStaff && (
                    <li>Staff to add: {setupData.staff.staffToAdd.length}</li>
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCreateHotel}
                  disabled={isCreating || debugMode}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {isCreating ? 'Creating Hotel...' : 'Complete Setup & Create Hotel'}
                </button>
                
                {debugMode && (
                  <button
                    onClick={() => window.location.replace('/dashboard')}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2 rounded-md font-medium"
                  >
                    Go to Dashboard (Debug)
                  </button>
                )}
                
                <button
                  onClick={prevStep}
                  disabled={isCreating}
                  className="w-full bg-muted text-muted-foreground hover:bg-muted/90 h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSetupWizard;
