
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestLoginFormProps {
  guestCredentials: {
    hotelCode: string;
    roomCode: string;
  };
  setGuestCredentials: React.Dispatch<React.SetStateAction<{
    hotelCode: string;
    roomCode: string;
  }>>;
  isLoading: boolean;
  handleGuestLogin: (e: React.FormEvent) => Promise<void>;
}

const GuestLoginForm: React.FC<GuestLoginFormProps> = ({
  guestCredentials,
  setGuestCredentials,
  isLoading,
  handleGuestLogin
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Guest Access</CardTitle>
      <CardDescription>
        Enter your codes provided by your hotel to access services
      </CardDescription>
    </CardHeader>
    <form onSubmit={handleGuestLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hotelCode">Hotel Code</Label>
          <Input
            id="hotelCode"
            type="text"
            placeholder="e.g. HOTEL123"
            value={guestCredentials.hotelCode}
            onChange={(e) =>
              setGuestCredentials({
                ...guestCredentials,
                hotelCode: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomCode">Room Code</Label>
          <Input
            id="roomCode"
            type="text"
            placeholder="Enter your room code"
            value={guestCredentials.roomCode}
            onChange={(e) =>
              setGuestCredentials({
                ...guestCredentials,
                roomCode: e.target.value,
              })
            }
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

export default GuestLoginForm;
