
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestHotelConnectFormProps {
  isLoading: boolean;
  onConnect: (hotelName: string, roomCode: string, roomNumber: string) => Promise<void>;
}

const GuestHotelConnectForm: React.FC<GuestHotelConnectFormProps> = ({
  isLoading,
  onConnect,
}) => {
  const [hotelName, setHotelName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(hotelName.trim(), roomCode.trim(), roomNumber.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Room Connection</CardTitle>
        <CardDescription>
          Enter your hotel name and the room code provided by your hotel.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelName">Hotel Name</Label>
            <Input
              id="hotelName"
              type="text"
              placeholder="Enter hotel name (e.g. MarbellaCorfu)"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              type="text"
              placeholder="e.g. 101"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomCode">Room Access Code</Label>
            <Input
              id="roomCode"
              type="text"
              placeholder="Enter the code provided by your hotel"
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
