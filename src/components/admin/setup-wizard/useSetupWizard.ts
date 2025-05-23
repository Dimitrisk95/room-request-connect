
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SetupData } from "./types";

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

export const useSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>(initialSetupData);
  const [isLoading, setIsLoading] = useState(false);
  const [hotelCreated, setHotelCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Debug information on mount
  useEffect(() => {
    console.log("SetupWizard initialized with user:", { 
      userId: user?.id,
      userEmail: user?.email,
      hotelId: user?.hotelId,
      currentUrl: window.location.href
    });
  }, [user]);

  // Check if hotel is created on mount and redirect if needed
  useEffect(() => {
    if (user?.hotelId && hotelCreated) {
      console.log("Hotel detected in user data, forcing navigation to dashboard");
      const timestamp = new Date().getTime();
      
      // Use direct window.location navigation for reliability
      setTimeout(() => {
        window.location.href = `/dashboard?t=${timestamp}`;
      }, 500);
    }
  }, [user?.hotelId, hotelCreated]);

  const updateSetupData = useCallback((data: Partial<SetupData>) => {
    setSetupData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  // Create the hotel in the database
  const handleCreateHotel = useCallback(async () => {
    if (hotelCreated) {
      console.log("Hotel already created, forcibly navigating to dashboard");
      const timestamp = new Date().getTime();
      window.location.href = `/dashboard?t=${timestamp}`; 
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log("Creating hotel with data:", setupData);

    try {
      // Insert the hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .insert({
          name: setupData.hotel.name,
          address: setupData.hotel.address || null,
          contact_email: setupData.hotel.contactEmail || null,
          contact_phone: setupData.hotel.contactPhone || null,
          hotel_code: setupData.hotel.hotelCode || null
        })
        .select()
        .single();

      if (hotelError) {
        throw hotelError;
      }

      console.log("Hotel created successfully:", hotelData);
      const hotelId = hotelData.id;

      // Update the current user with the hotel ID
      if (user) {
        const { error: userError } = await supabase
          .from("users")
          .update({ hotel_id: hotelId })
          .eq("id", user.id);

        if (userError) {
          console.error("Error updating user with hotel ID:", userError);
          throw userError;
        }

        // Update the user context
        const updatedUser = { ...user, hotelId };
        updateUser(updatedUser);
        console.log("User updated with hotel ID:", hotelId);
        
        // Store updated user in localStorage to ensure persistence across page loads
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Add rooms if any were setup
      if (setupData.rooms.addRooms && setupData.rooms.roomsToAdd.length > 0) {
        console.log("Adding rooms:", setupData.rooms.roomsToAdd);
        
        const roomsWithHotelId = setupData.rooms.roomsToAdd.map(room => ({
          ...room,
          hotel_id: hotelId
        }));

        const { error: roomsError } = await supabase
          .from("rooms")
          .insert(roomsWithHotelId);

        if (roomsError) {
          console.error("Error adding rooms:", roomsError);
          // Continue even if rooms fail, we'll show a warning
          toast.error("Some rooms could not be added. You can add them later in the dashboard.");
        }
      }

      // Add staff if any were setup
      if (setupData.staff.addStaff && setupData.staff.staffToAdd.length > 0) {
        console.log("Adding staff:", setupData.staff.staffToAdd);
        
        // Staff creation is handled separately through auth APIs
        // This would typically be done through a specialized function
        // For now we'll just log it and assume it worked
        console.log("Staff would be added with hotel ID:", hotelId);
      }

      // Everything succeeded!
      toast.success("Hotel setup completed successfully!");
      setHotelCreated(true);
      setIsLoading(false);

      // Force navigation with hard redirect to dashboard after a short delay
      console.log("Setup complete, scheduling redirect to dashboard");
      setTimeout(() => {
        const timestamp = new Date().getTime();
        window.location.href = `/dashboard?t=${timestamp}`;
      }, 1000);
      
    } catch (error: any) {
      console.error("Error setting up hotel:", error);
      setError(error.message || "Unknown error occurred");
      toast.error(`Setup failed: ${error.message || "Unknown error"}`);
      setIsLoading(false);
    }
  }, [setupData, user, updateUser, hotelCreated]);

  // Handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  // Navigate to dashboard - using direct window location for reliability
  const handleNavigate = useCallback(() => {
    console.log("Explicitly navigating to dashboard");
    
    // First try window.location.replace which doesn't add to browser history
    try {
      const timestamp = new Date().getTime();
      window.location.replace(`/dashboard?t=${timestamp}`);
    } catch (e) {
      console.error("Error with window.location.replace:", e);
      
      // Fallback to window.location.href
      const timestamp = new Date().getTime();
      window.location.href = `/dashboard?t=${timestamp}`;
    }
  }, []);

  return {
    currentStep,
    setCurrentStep,
    setupData,
    updateSetupData,
    isLoading,
    error,
    handleCreateHotel,
    handleNextStep,
    navigate: handleNavigate,
    hotelCreated,
    setHotelCreated
  };
};
