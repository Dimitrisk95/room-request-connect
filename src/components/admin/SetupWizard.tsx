
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Hotel, Check, Users, Bed } from "lucide-react";
import HotelSetupStep from "./setup-wizard/HotelSetupStep";
import RoomsSetupStep from "./setup-wizard/RoomsSetupStep";
import StaffSetupStep from "./setup-wizard/StaffSetupStep";
import CompletionStep from "./setup-wizard/CompletionStep";
import { supabase } from "@/integrations/supabase/client";

export interface SetupData {
  hotel: {
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
  };
  rooms: {
    addRooms: boolean;
    createdRooms: number;
  };
  staff: {
    addStaff: boolean;
    createdStaff: number;
  };
}

const SetupWizard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<SetupData>({
    hotel: {
      name: "",
      address: "",
      contactEmail: user?.email || "",
      contactPhone: "",
    },
    rooms: {
      addRooms: false,
      createdRooms: 0,
    },
    staff: {
      addStaff: false,
      createdStaff: 0,
    },
  });

  const steps = [
    { id: "hotel", label: "Hotel Information", icon: <Hotel className="h-5 w-5" /> },
    { id: "rooms", label: "Add Rooms", icon: <Bed className="h-5 w-5" /> },
    { id: "staff", label: "Add Staff", icon: <Users className="h-5 w-5" /> },
    { id: "complete", label: "Complete", icon: <Check className="h-5 w-5" /> },
  ];

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
    if (!setupData.hotel.name.trim()) {
      toast({
        title: "Hotel name required",
        description: "Please provide a name for your hotel to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create new hotel in the hotels table
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert([{ 
          name: setupData.hotel.name,
          address: setupData.hotel.address || null,
          contact_email: setupData.hotel.contactEmail || null,
          contact_phone: setupData.hotel.contactPhone || null,
        }])
        .select('id, name')
        .single();

      if (hotelError) {
        if (hotelError.code === '23505') {
          throw new Error('A hotel with this name already exists. Please choose a different name.');
        }
        throw hotelError;
      }

      if (!hotelData) {
        throw new Error('Failed to create hotel');
      }

      // Update the user's hotel_id
      const { error: updateError } = await supabase
        .from("users")
        .update({ hotel_id: hotelData.id })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      // Update local user state
      if (user) {
        const updatedUser = { ...user, hotelId: hotelData.id };
        updateUser(updatedUser);
      }

      // Continue to next step
      nextStep();
    } catch (error: any) {
      console.error("Error creating hotel:", error);
      toast({
        title: "Failed to create hotel",
        description: error.message || "There was an error creating the hotel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipOrComplete = () => {
    if (currentStep < steps.length - 2) { // Not the last two steps
      nextStep();
    } else if (currentStep === steps.length - 2) { // Second to last step
      setCurrentStep(steps.length - 1); // Go to completion
      window.scrollTo(0, 0);
    } else { // Last step
      navigate("/dashboard");
    }
  };

  const updateHotelData = (data: Partial<SetupData["hotel"]>) => {
    setSetupData(prev => ({
      ...prev,
      hotel: { ...prev.hotel, ...data }
    }));
  };

  const updateRoomsData = (data: Partial<SetupData["rooms"]>) => {
    setSetupData(prev => ({
      ...prev,
      rooms: { ...prev.rooms, ...data }
    }));
  };

  const updateStaffData = (data: Partial<SetupData["staff"]>) => {
    setSetupData(prev => ({
      ...prev,
      staff: { ...prev.staff, ...data }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
              onSubmit={handleCreateHotel}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 1 && (
            <RoomsSetupStep 
              roomsData={setupData.rooms}
              updateRoomsData={updateRoomsData}
              onNext={nextStep}
              onSkip={handleSkipOrComplete}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 2 && (
            <StaffSetupStep 
              staffData={setupData.staff}
              updateStaffData={updateStaffData}
              onNext={nextStep}
              onSkip={handleSkipOrComplete}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <CompletionStep 
              setupData={setupData} 
              onComplete={() => navigate("/dashboard")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupWizard;
