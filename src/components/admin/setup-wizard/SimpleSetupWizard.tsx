
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import HotelSetupStep from "./HotelSetupStep";
import { SetupData } from "./types";
import { useState } from "react";
import { useSetupSteps } from "./hooks/useSetupSteps";
import { useHotelSetup } from "./hooks/useHotelSetup";

const defaultSetupData: SetupData = {
  hotel: {
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    hotelCode: "",
  },
  rooms: {
    addRooms: false,
    createdRooms: 0,
    roomsToAdd: [],
  },
  staff: {
    addStaff: false,
    createdStaff: 0,
    staffToAdd: [],
  },
};

const SimpleSetupWizard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [setupData, setSetupData] = useState<SetupData>(defaultSetupData);
  const { isCreating, handleCreateHotel } = useHotelSetup();
  const { currentStep, steps, nextStep, prevStep } = useSetupSteps();

  const updateSetupData = (data: Partial<SetupData>) => {
    console.log("Updating setup data:", data);
    setSetupData((prev) => ({ ...prev, ...data }));
  };

  const updateHotelData = (data: Partial<typeof setupData.hotel>) => {
    console.log("Updating hotel data:", data);
    updateSetupData({ hotel: { ...setupData.hotel, ...data } });
  };

  const handleComplete = async () => {
    console.log("[SimpleSetupWizard] Complete button clicked");
    console.log("[SimpleSetupWizard] Current setup data:", setupData);
    console.log("[SimpleSetupWizard] isCreating state:", isCreating);

    // Validate required fields
    if (!setupData.hotel.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Hotel name is required",
        variant: "destructive",
      });
      return;
    }

    if (!setupData.hotel.hotelCode.trim()) {
      toast({
        title: "Validation Error", 
        description: "Hotel code is required",
        variant: "destructive",
      });
      return;
    }

    if (isCreating) {
      console.log("[SimpleSetupWizard] Already creating, ignoring click");
      return;
    }

    const success = await handleCreateHotel(setupData);
    console.log("[SimpleSetupWizard] Hotel creation result:", success);

    if (success) {
      console.log("[SimpleSetupWizard] Hotel created successfully, redirecting...");
      
      // Force redirect after successful creation
      setTimeout(() => {
        console.log("[SimpleSetupWizard] Executing redirect to dashboard");
        window.location.href = "/dashboard";
      }, 1500);
    }
  };

  const handleFormSubmit = () => {
    console.log("Form submitted, moving to completion step");
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Steps steps={steps} currentStep={currentStep} className="mb-8" />

      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <HotelSetupStep
              hotelData={setupData.hotel}
              updateHotelData={updateHotelData}
              onNext={handleFormSubmit}
              isLoading={false}
              hotelCreated={false}
            />
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Ready to Create Your Hotel!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your hotel information has been collected. Click below to
                  create your hotel and start managing your property.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Hotel Details</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    <strong>Name:</strong> {setupData.hotel.name}
                  </li>
                  <li>
                    <strong>Code:</strong> {setupData.hotel.hotelCode}
                  </li>
                  {setupData.hotel.address && (
                    <li>
                      <strong>Address:</strong> {setupData.hotel.address}
                    </li>
                  )}
                  {setupData.hotel.contactEmail && (
                    <li>
                      <strong>Email:</strong> {setupData.hotel.contactEmail}
                    </li>
                  )}
                  {setupData.hotel.contactPhone && (
                    <li>
                      <strong>Phone:</strong> {setupData.hotel.contactPhone}
                    </li>
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleComplete}
                  disabled={isCreating}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating
                    ? "Creating Hotel..."
                    : "Complete Setup and Create Hotel"}
                </button>

                <button
                  onClick={prevStep}
                  disabled={isCreating}
                  className="w-full bg-muted text-muted-foreground hover:bg-muted/90 h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  Back to Edit Details
                </button>
              </div>

              {isCreating && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Please wait while we create your hotel...
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSetupWizard;
