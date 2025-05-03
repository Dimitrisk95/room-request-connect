
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SetupData } from "./types";

export const useSetupWizard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<SetupData>({
    hotel: {
      name: "",
      address: "",
      contactEmail: user?.email || "",
      contactPhone: "",
      hotelCode: "",
    },
    rooms: {
      addRooms: false,
      createdRooms: 0,
    },
    staff: {
      addStaff: false,
      createdStaff: 0,
    },
  });

  const updateSetupData = (newData: Partial<SetupData>) => {
    setSetupData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleCreateHotel = async () => {
    if (!setupData.hotel.name.trim()) {
      toast({
        title: "Hotel name required",
        description: "Please provide a name for your hotel to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!setupData.hotel.hotelCode.trim()) {
      toast({
        title: "Hotel code required",
        description: "Please provide a hotel connection code to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if hotel name already exists
      const { data: existingHotelsByName, error: nameCheckError } = await supabase
        .from("hotels")
        .select("id")
        .eq("name", setupData.hotel.name)
        .maybeSingle();

      if (nameCheckError) throw nameCheckError;

      if (existingHotelsByName) {
        throw new Error('A hotel with this name already exists. Please choose a different name.');
      }

      // Check if hotel code already exists
      const { data: existingHotelsByCode, error: codeCheckError } = await supabase
        .from("hotels")
        .select("id")
        .eq("hotel_code", setupData.hotel.hotelCode)
        .maybeSingle();

      if (codeCheckError) throw codeCheckError;

      if (existingHotelsByCode) {
        throw new Error('This hotel code is already taken. Please choose a different code.');
      }

      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert([{ 
          name: setupData.hotel.name,
          address: setupData.hotel.address || null,
          contact_email: setupData.hotel.contactEmail || null,
          contact_phone: setupData.hotel.contactPhone || null,
          hotel_code: setupData.hotel.hotelCode,
        }])
        .select('id, name, hotel_code')
        .single();

      if (hotelError) {
        if (hotelError.code === '23505') {
          throw new Error('A hotel with this name or code already exists. Please choose different values.');
        }
        throw hotelError;
      }

      if (!hotelData) {
        throw new Error('Failed to create hotel');
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ hotel_id: hotelData.id })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      if (user) {
        const updatedUser = { ...user, hotelId: hotelData.id };
        updateUser(updatedUser);
      }

      setCurrentStep(prev => prev + 1);
      
      toast({
        title: "Hotel created successfully",
        description: `Your hotel '${hotelData.name}' has been created with code '${hotelData.hotel_code}'`,
      });
      
      // Cache the hotel code
      localStorage.setItem(`hotelCode_${hotelData.id}`, hotelData.hotel_code);
      
    } catch (error: any) {
      console.error("Error creating hotel:", error);
      toast({
        title: "Failed to create hotel",
        description: error.message || "There was an error creating the hotel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    setupData,
    updateSetupData,
    isLoading,
    handleCreateHotel,
    navigate
  };
};
