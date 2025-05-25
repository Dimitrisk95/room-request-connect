
import { useSetupData } from "./hooks/useSetupData";
import { useHotelCreation } from "./hooks/useHotelCreation";
import { useSetupNavigation } from "./hooks/useSetupNavigation";

export const useSetupWizard = () => {
  const { setupData, updateSetupData } = useSetupData();
  const { isLoading, hotelCreated, setHotelCreated, error, handleCreateHotel } = useHotelCreation();
  const { currentStep, setCurrentStep, handleNextStep, navigate } = useSetupNavigation();

  // Create hotel with current setup data
  const createHotel = () => handleCreateHotel(setupData);

  return {
    currentStep,
    setCurrentStep,
    setupData,
    updateSetupData,
    isLoading,
    error,
    handleCreateHotel: createHotel,
    handleNextStep,
    navigate,
    hotelCreated,
    setHotelCreated
  };
};
