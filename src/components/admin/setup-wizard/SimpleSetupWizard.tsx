
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Hotel, Check } from "lucide-react";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import HotelSetupStep from "./HotelSetupStep";
import { SetupData } from "./types";

interface SimpleSetupWizardProps {
  debugMode?: boolean;
}

const SimpleSetupWizard = ({ debugMode = false }: SimpleSetupWizardProps) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
      // 1. Validate required fields
      if (!setupData.hotel.name.trim()) {
        throw new Error("Hotel name is required");
      }
      if (!setupData.hotel.hotelCode.trim()) {
        throw new Error("Hotel code is required");
      }

      // 2. Insert the hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: setupData.hotel.name.trim(),
          address: setupData.hotel.address?.trim() || null,
          contact_email: setupData.hotel.contactEmail?.trim() || null,
          contact_phone: setupData.hotel.contactPhone?.trim() || null,
          hotel_code: setupData.hotel.hotelCode.trim()
        })
        .select()
        .single();

      if (hotelError) {
        console.error("Hotel creation error:", hotelError);
        throw hotelError;
      }
      console.log("Hotel created successfully:", hotelData);
      const hotelId = hotelData.id;

      // 3. Insert all rooms, if any
      if (setupData.rooms.addRooms && setupData.rooms.roomsToAdd.length > 0) {
        // Prepare room objects, ensure required fields are present
        const rooms = setupData.rooms.roomsToAdd.map((room: any) => ({
          ...room,
          hotel_id: hotelId,
          status: room.status || "vacant", // default status
          bed_type: room.bedType || "single",
          room_number: room.roomNumber,
          type: room.type || "standard",
          capacity: room.capacity || 2,
        }));

        const { error: roomsError } = await supabase
          .from("rooms")
          .insert(rooms);

        if (roomsError) {
          console.error("Rooms insertion error:", roomsError);
          toast({
            title: "Room Creation Error",
            description: "Some rooms could not be added. You can add them later in the dashboard.",
            variant: "destructive"
          });
        }
      }

      // 4. Insert all staff, if any
      if (setupData.staff.addStaff && setupData.staff.staffToAdd.length > 0) {
        // For each staff member, create a user entry with staff role
        for (const staff of setupData.staff.staffToAdd) {
          if (!staff.email || !staff.name) continue;
          // Staff should set their own password later; mark as needs_password_setup
          const { error: staffError } = await supabase
            .from("users")
            .insert({
              name: staff.name,
              email: staff.email,
              role: "staff",
              hotel_id: hotelId,
              can_manage_rooms: !!staff.can_manage_rooms,
              can_manage_staff: !!staff.can_manage_staff,
              password_hash: "to-be-set", // Supabase Auth handles the password, this will be fixed by email flow
              needs_password_setup: true,
              email_verified: false
            });
          if (staffError) {
            console.error("Staff insert error:", staffError);
            toast({
              title: "Staff Creation Error",
              description: `Could not add staff: ${staff.name} (${staff.email}).`,
              variant: "destructive"
            });
          }
        }
      }

      // 5. Update the current user with the hotel ID
      if (user) {
        const { error: userError } = await supabase
          .from("users")
          .update({ hotel_id: hotelId })
          .eq("id", user.id);

        if (userError) {
          console.error("User update error:", userError);
          throw userError;
        }

        // Update the user context
        const updatedUser = { ...user, hotelId };
        updateUser(updatedUser);
        console.log("User updated with hotel ID:", hotelId);
      }

      toast({
        title: "Hotel setup completed successfully!",
        description: "Your hotel is now ready. Redirecting to dashboard...",
      });

      // Redirect to dashboard after creation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error("Error setting up hotel:", error);

      let errorMessage = "Setup failed. Please try again.";
      if (error.message?.includes("duplicate key")) {
        errorMessage = "A hotel with this code already exists. Please choose a different code.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Setup Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  const updateHotelData = (data: Partial<typeof setupData.hotel>) => {
    updateSetupData({ hotel: { ...setupData.hotel, ...data } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
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
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Ready to Create Your Hotel!</h2>
                <p className="text-muted-foreground mb-6">
                  Your hotel information has been collected. Click below to create your hotel and start managing your property.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Hotel Details</h3>
                <ul className="text-sm space-y-1">
                  <li><strong>Name:</strong> {setupData.hotel.name}</li>
                  <li><strong>Code:</strong> {setupData.hotel.hotelCode}</li>
                  {setupData.hotel.address && (
                    <li><strong>Address:</strong> {setupData.hotel.address}</li>
                  )}
                  {setupData.hotel.contactEmail && (
                    <li><strong>Email:</strong> {setupData.hotel.contactEmail}</li>
                  )}
                  {setupData.hotel.contactPhone && (
                    <li><strong>Phone:</strong> {setupData.hotel.contactPhone}</li>
                  )}
                </ul>
                {setupData.rooms.addRooms && setupData.rooms.roomsToAdd.length > 0 && (
                  <div className="mt-2 text-left text-xs">
                    <span className="font-semibold">Rooms to Add:</span> {setupData.rooms.roomsToAdd.length}
                  </div>
                )}
                {setupData.staff.addStaff && setupData.staff.staffToAdd.length > 0 && (
                  <div className="mt-1 text-left text-xs">
                    <span className="font-semibold">Staff to Add:</span> {setupData.staff.staffToAdd.length}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCreateHotel}
                  disabled={isCreating || debugMode}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating Hotel...' : 'Create Hotel & Continue'}
                </button>
                
                {debugMode && (
                  <button
                    onClick={() => navigate('/dashboard')}
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
                  Back to Edit Details
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

