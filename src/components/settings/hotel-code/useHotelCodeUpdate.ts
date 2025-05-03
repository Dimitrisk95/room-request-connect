
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useHotelCodeUpdate = (
  hotelId: string,
  onCodeUpdated: (newCode: string) => void
) => {
  const { toast } = useToast();
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkCodeAvailability = async (code: string) => {
    setIsChecking(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id')
        .eq('hotel_code', code)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      if (data && data.id !== hotelId) {
        setError("This hotel code is already taken. Please try another one.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking code availability:', error);
      setError("Error checking code availability. Please try again.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const updateHotelCode = async () => {
    if (!hotelId || !newCode) return;
    
    // Validate the format of the code
    if (!/^[a-zA-Z0-9]+$/.test(newCode)) {
      setError("Hotel code can only contain letters and numbers (no spaces or special characters)");
      return;
    }
    
    if (newCode.length < 3 || newCode.length > 20) {
      setError("Hotel code must be between 3 and 20 characters");
      return;
    }
    
    // Check if code is available
    const isAvailable = await checkCodeAvailability(newCode);
    if (!isAvailable) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ hotel_code: newCode })
        .eq('id', hotelId);

      if (error) throw error;
      
      // Update local state and cache
      onCodeUpdated(newCode);
      setNewCode('');
      localStorage.setItem(`hotelCode_${hotelId}`, newCode);
      
      toast({
        title: "Hotel Code Updated",
        description: "Your hotel code has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to update hotel code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newCode,
    setNewCode,
    error,
    isLoading,
    isChecking,
    updateHotelCode
  };
};
