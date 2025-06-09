
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context';

export const useQRCodeScanner = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanResult = async (scannedData: string) => {
    try {
      // Parse the scanned data to extract room information
      const roomCode = scannedData.trim().toUpperCase();
      
      // Look up the room by its code
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .eq('hotel_id', user?.hotelId)
        .single();

      if (error || !room) {
        toast({
          title: "Room Not Found",
          description: "The scanned QR code doesn't match any room in your hotel.",
          variant: "destructive"
        });
        return;
      }

      // Navigate to room details or show quick actions
      toast({
        title: "Room Found",
        description: `Accessing Room ${room.room_number}`,
      });

      // You can navigate to room details or show a quick action modal
      navigate(`/rooms?highlight=${room.id}`);
      
    } catch (error) {
      console.error('Error processing QR scan:', error);
      toast({
        title: "Error",
        description: "Failed to process the scanned code.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return {
    isScanning,
    startScanning,
    stopScanning,
    handleScanResult
  };
};
