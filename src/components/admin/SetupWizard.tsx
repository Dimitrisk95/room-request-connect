import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Hotel, Check, Users, Bed } from "lucide-react";
import HotelSetupStep from "./setup-wizard/HotelSetupStep";
import RoomsSetupStep from "./setup-wizard/RoomsSetupStep";
import StaffSetupStep from "./setup-wizard/StaffSetupStep";
import CompletionStep from "./setup-wizard/CompletionStep";
import { useSetupWizard } from "./setup-wizard/useSetupWizard";
import { useEffect } from "react";

export { type SetupData } from "./setup-wizard/types";

interface SetupWizardProps {
  debugMode?: boolean;
}

const SetupWizard = ({ debugMode = false }: SetupWizardProps) => {
  const {
    currentStep,
    setCurrentStep,
    setupData,
    updateSetupData,
    isLoading,
    handleCreateHotel,
    handleNextStep,
    hotelCreated,
    navigate
  } = useSetupWizard();

  useEffect(() => {
    // Debug info
    console.log("Current setup state:", {
      currentStep,
      hotelData: setupData.hotel,
      hotelCreated,
      isLoading,
      debugMode
    });
  }, [currentStep, setupData, hotelCreated, isLoading, debugMode]);

  // If hotel is created and we're on the completion step, check if we should navigate
  useEffect(() => {
    if (hotelCreated && currentStep === 3 && !isLoading && !debugMode) {
      console.log("Hotel already created and on completion step - ready for dashboard");
    }
  }, [hotelCreated, currentStep, isLoading, debugMode]);

  const steps = [
    { id: "hotel", label: "Hotel Information", icon: <Hotel className="h-5 w-5" />, required: true },
    { id: "rooms", label: "Add Rooms", icon: <Bed className="h-5 w-5" />, required: false },
    { id: "staff", label: "Add Staff", icon: <Users className="h-5 w-5" />, required: false },
    { id: "complete", label: "Complete", icon: <Check className="h-5 w-5" />, required: true },
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

  const skipToCompletion = () => {
    setCurrentStep(steps.length - 1);
    window.scrollTo(0, 0);
  };

  const handleSkipOrComplete = () => {
    if (currentStep < steps.length - 2) {
      nextStep();
    } else if (currentStep === steps.length - 2) {
      setCurrentStep(steps.length - 1);
      window.scrollTo(0, 0);
    } else {
      navigate();
    }
  };

  const updateHotelData = (data: Partial<typeof setupData.hotel>) => {
    updateSetupData({
      hotel: { ...setupData.hotel, ...data }
    });
  };

  const updateRoomsData = (data: Partial<typeof setupData.rooms>) => {
    updateSetupData({
      rooms: { ...setupData.rooms, ...data }
    });
  };

  const updateStaffData = (data: Partial<typeof setupData.staff>) => {
    updateSetupData({
      staff: { ...setupData.staff, ...data }
    });
  };

  // For handling the Complete step button (creates hotel and navigates to dashboard)
  const handleComplete = () => {
    console.log("Complete button clicked in SetupWizard, hotel created status:", hotelCreated);
    if (!hotelCreated && !debugMode) {
      handleCreateHotel();
    } else {
      console.log("Hotel already created or debug mode enabled, explicitly navigating to dashboard");
      navigate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {debugMode && (
        <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700 font-medium flex items-center gap-2">
            <span className="bg-red-200 p-1 rounded-full">
              <Bug size={16} className="text-red-700" />
            </span>
            Debug Mode Enabled: Automatic redirects are disabled
          </p>
          <p className="text-sm text-red-600 mt-1">
            This mode allows you to test the setup wizard without creating hotels.
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
              isLoading={isLoading}
              hotelCreated={hotelCreated}
            />
          )}
          
          {currentStep === 1 && (
            <RoomsSetupStep 
              roomsData={setupData.rooms}
              updateRoomsData={updateRoomsData}
              onNext={nextStep}
              onSkip={handleSkipOrComplete}
              onBack={prevStep}
              skipToCompletion={skipToCompletion}
            />
          )}
          
          {currentStep === 2 && (
            <StaffSetupStep 
              staffData={setupData.staff}
              updateStaffData={updateStaffData}
              onNext={nextStep}
              onSkip={handleSkipOrComplete}
              onBack={prevStep}
              skipToCompletion={skipToCompletion}
            />
          )}
          
          {currentStep === 3 && (
            <CompletionStep 
              setupData={setupData} 
              onComplete={handleComplete}
              isLoading={isLoading}
              hotelCreated={hotelCreated}
              debugMode={debugMode}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupWizard;
