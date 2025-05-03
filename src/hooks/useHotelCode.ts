
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";

export const useHotelCode = () => {
  const { user } = useAuth();
  const [hotelCode, setHotelCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHotelCode = async () => {
      if (!user?.hotelId) {
        setHotelCode(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('hotels')
          .select('hotel_code')
          .eq('id', user.hotelId)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setHotelCode(data?.hotel_code);
      } catch (err) {
        console.error("Error fetching hotel code:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelCode();
  }, [user?.hotelId]);

  return { hotelCode, isLoading, error };
};
