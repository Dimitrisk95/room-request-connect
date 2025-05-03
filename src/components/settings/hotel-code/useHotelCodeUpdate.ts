
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  validateHotelCodeFormat, 
  checkHotelCodeAvailability, 
  updateHotelCodeInDatabase 
} from './hotelCodeUtils';

export const useHotelCodeUpdate = (
  hotelId: string,
  onCodeUpdated: (newCode: string) => void
) => {
  const { toast } = useToast();
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const updateHotelCode = async () => {
    if (!hotelId || !newCode) return;
    
    // Validate the format of the code
    const formatValidation = validateHotelCodeFormat(newCode);
    if (!formatValidation.isValid) {
      setError(formatValidation.error);
      return;
    }
    
    // Check if code is available
    setIsChecking(true);
    const availabilityCheck = await checkHotelCodeAvailability(newCode, hotelId);
    setIsChecking(false);
    
    if (!availabilityCheck.isAvailable) {
      setError(availabilityCheck.error);
      return;
    }
    
    // Update the code in the database
    setIsLoading(true);
    const result = await updateHotelCodeInDatabase(hotelId, newCode);
    setIsLoading(false);
    
    if (!result.success) {
      setError(result.error);
      return;
    }
    
    // Update local state and cache
    onCodeUpdated(newCode);
    setNewCode('');
    localStorage.setItem(`hotelCode_${hotelId}`, newCode);
    
    toast({
      title: "Hotel Code Updated",
      description: "Your hotel code has been successfully updated.",
    });
  };

  return {
    newCode,
    setNewCode,
    error,
    isLoading,
    isChecking,
    updateHotelCode,
    clearError: () => setError(null)
  };
};
