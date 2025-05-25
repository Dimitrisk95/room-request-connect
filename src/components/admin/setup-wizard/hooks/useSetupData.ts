
import { useState, useCallback } from "react";
import { SetupData } from "../types";

// Initial setup data with empty values
const initialSetupData: SetupData = {
  hotel: {
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    hotelCode: ""
  },
  rooms: {
    addRooms: false,
    createdRooms: 0,
    roomsToAdd: []
  },
  staff: {
    addStaff: false,
    createdStaff: 0,
    staffToAdd: []
  }
};

export const useSetupData = () => {
  const [setupData, setSetupData] = useState<SetupData>(initialSetupData);

  const updateSetupData = useCallback((data: Partial<SetupData>) => {
    setSetupData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  return {
    setupData,
    updateSetupData
  };
};
