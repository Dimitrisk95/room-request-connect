
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateRoomCode } from "@/utils/codeGenerator";
import RoomQRCode from "./RoomQRCode";
import { RefreshCw } from "lucide-react";

interface RoomCodeTabProps {
  room: {
    id: string;
    roomNumber: string;
    room_code?: string;
  };
  hotelCode: string;
  onCodeUpdated: (newCode: string) => void;
}

const RoomCodeTab: React.FC<RoomCodeTabProps> = ({
  room,
  hotelCode,
  onCodeUpdated
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [roomCode, setRoomCode] = useState(room.room_code || '');

  const handleRegenerateCode = async () => {
    setIsLoading(true);
    try {
      const newRoomCode = generateRoomCode(hotelCode, room.roomNumber);
      
      // Fixed the property name to room_code to match the database schema
      const { error } = await supabase
        .from('rooms')
        .update({ room_code: newRoomCode })
        .eq('id', room.id);
      
      if (error) throw error;
      
      setRoomCode(newRoomCode);
      onCodeUpdated(newRoomCode);
      
      toast({
        title: "Room Code Updated",
        description: `Room code for ${room.roomNumber} has been regenerated successfully.`
      });
    } catch (error) {
      console.error("Error regenerating room code:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate room code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {roomCode ? (
        <RoomQRCode
          hotelCode={hotelCode}
          roomCode={roomCode}
          roomNumber={room.roomNumber}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No room code has been generated yet</p>
          <Button onClick={handleRegenerateCode} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Generate Room Code
          </Button>
        </div>
      )}
      
      {roomCode && (
        <Button 
          variant="outline" 
          onClick={handleRegenerateCode} 
          disabled={isLoading}
          className="w-full mt-4"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate Code
        </Button>
      )}
    </div>
  );
};

export default RoomCodeTab;
