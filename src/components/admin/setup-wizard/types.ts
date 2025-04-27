
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

export interface StepProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setupData: SetupData;
  updateSetupData: (data: Partial<SetupData>) => void;
  isLoading?: boolean;
}
