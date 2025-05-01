
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context';
import { useToast } from '@/hooks/use-toast';

export const useHotelCode = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hotelCode, setHotelCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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
      const { data, error } = await supabase
        .from('hotels')
        .select('hotel_code')
        .eq('id', user?.hotelId)
        .single();

      if (error) throw error;
      
      if (data && data.hotel_code) {
        setHotelCode(data.hotel_code);
      }
    } catch (error) {
      console.error('Error fetching hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotel code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hotelCode,
    setHotelCode,
    isLoading
  };
};
