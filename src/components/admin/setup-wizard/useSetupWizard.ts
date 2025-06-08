
import { useSetupData } from "./hooks/useSetupData";
import { useHotelCreation } from "./hooks/useHotelCreation";
import { useSetupNavigation } from "./hooks/useSetupNavigation";

export const useSetupWizard = () => {
  const { setupData, updateSetupData } = useSetupData();
  const { isLoading, hotelCreated, setHotelCreated, error, handleCreateHotel } = useHotelCreation();
  const { currentStep, setCurrentStep, handleNextStep, navigate } = useSetupNavigation();

  // Simplified hotel creation and navigation
  const createHotelAndNavigate = async () => {
    console.log("Creating hotel and navigating...");
    
    if (hotelCreated) {
      console.log("Hotel already created, navigating directly");
      navigate();
      return;
    }
    
    const success = await handleCreateHotel(setupData);
    
    if (success) {
      console.log("Hotel created successfully, navigating to dashboard");
      // Navigate immediately after successful creation
      navigate();
    } else {
      console.error("Hotel creation failed");
    }
  };

  return {
    currentStep,
    setCurrentStep,
    setupData,
    updateSetupData,
    isLoading,
    error,
    handleCreateHotel: createHotelAndNavigate,
    handleNextStep,
    navigate,
    hotelCreated,
    setHotelCreated
  };
};
