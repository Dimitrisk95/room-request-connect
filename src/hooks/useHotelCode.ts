
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context';
import { useToast } from '@/hooks/use-toast';

export const useHotelCode = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hotelCode, setHotelCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.hotelId) {
      fetchHotelCode();
    } else {
      setIsLoading(false);
    }
  }, [user?.hotelId]);

  const fetchHotelCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check localStorage cache first
      const cachedCode = localStorage.getItem(`hotelCode_${user?.hotelId}`);
      if (cachedCode) {
        setHotelCode(cachedCode);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('hotels')
        .select('hotel_code')
        .eq('id', user?.hotelId)
        .single();

      if (error) {
        console.error('Error fetching hotel code:', error);
        setError('Failed to fetch hotel code');
        throw error;
      }
      
      if (data && data.hotel_code) {
        setHotelCode(data.hotel_code);
        // Cache the hotel code
        localStorage.setItem(`hotelCode_${user?.hotelId}`, data.hotel_code);
      } else {
        setError('No hotel code found');
        console.warn('No hotel code found for this hotel');
      }
    } catch (error) {
      console.error('Error fetching hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotel code. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hotelCode,
    setHotelCode,
    isLoading,
    error,
    refetch: fetchHotelCode
  };
};
