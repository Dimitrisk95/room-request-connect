
import { useSetupData } from "./hooks/useSetupData";
import { useHotelCreation } from "./hooks/useHotelCreation";
import { useSetupNavigation } from "./hooks/useSetupNavigation";

export const useSetupWizard = () => {
  const { setupData, updateSetupData } = useSetupData();
  const { isLoading, hotelCreated, setHotelCreated, error, handleCreateHotel } = useHotelCreation();
  const { currentStep, setCurrentStep, handleNextStep, navigate } = useSetupNavigation();

  // Create hotel with current setup data and handle navigation
  const createHotelAndNavigate = async () => {
    console.log("Creating hotel and navigating...");
    const success = await handleCreateHotel(setupData);
    
    if (success) {
      console.log("Hotel created successfully, navigating to dashboard");
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        navigate();
      }, 500);
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
