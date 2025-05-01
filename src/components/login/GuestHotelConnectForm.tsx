
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestHotelConnectFormProps {
  isLoading: boolean;
  initialHotelCode?: string;
  initialRoomCode?: string;
  onConnect: (hotelCode: string, roomCode: string) => Promise<void>;
}

const GuestHotelConnectForm: React.FC<GuestHotelConnectFormProps> = ({
  isLoading,
  initialHotelCode = '',
  initialRoomCode = '',
  onConnect,
}) => {
  const [hotelCode, setHotelCode] = useState(initialHotelCode);
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [autoSubmit, setAutoSubmit] = useState(false);
  
  // Auto-submit the form if both codes are provided via URL
  useEffect(() => {
    if (initialHotelCode && initialRoomCode && !isLoading && !autoSubmit) {
      setAutoSubmit(true);
      handleSubmit(new Event('autosubmit') as unknown as React.FormEvent);
    }
  }, [initialHotelCode, initialRoomCode, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!e.type.includes('autosubmit')) {
      e.stopPropagation();
    }
    onConnect(hotelCode.trim(), roomCode.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Room Connection</CardTitle>
        <CardDescription>
          Enter your hotel code and room code provided by your hotel.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelCode">Hotel Code</Label>
            <Input
              id="hotelCode"
              type="text"
              placeholder="Enter hotel code (e.g. HOTEL123)"
              value={hotelCode}
              onChange={(e) => setHotelCode(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomCode">Room Code</Label>
            <Input
              id="roomCode"
              type="text"
              placeholder="Enter your room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connecting..." : "Connect to Room"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GuestHotelConnectForm;
