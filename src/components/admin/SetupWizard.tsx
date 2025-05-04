
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

const SetupWizard = () => {
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
      hotelCreated
    });
  }, [currentStep, setupData, hotelCreated]);

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
      navigate("/dashboard");
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
    if (!hotelCreated) {
      handleCreateHotel();
    } else {
      navigate("/dashboard");
    }
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupWizard;
