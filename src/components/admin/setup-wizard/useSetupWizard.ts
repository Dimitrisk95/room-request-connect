
import { useState } from "react";
import { useSetupData } from "./hooks/useSetupData";
import { useSetupNavigation } from "./hooks/useSetupNavigation";

export const useSetupWizard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setupData = useSetupData();
  const navigation = useSetupNavigation();

  return {
    ...setupData,
    ...navigation,
    isLoading,
    setIsLoading,
  };
};
