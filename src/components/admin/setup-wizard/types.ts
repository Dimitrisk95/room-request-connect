
export interface SetupData {
  hotel: {
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    hotelCode: string;
  };
  rooms: {
    addRooms: boolean;
    createdRooms: number;
    roomsToAdd: any[]; // Add this property for room data storage
  };
  staff: {
    addStaff: boolean;
    createdStaff: number;
    staffToAdd: any[]; // Add this property for staff data storage
  };
}

export interface StepProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setupData: SetupData;
  updateSetupData: (data: Partial<SetupData>) => void;
  isLoading?: boolean;
}
