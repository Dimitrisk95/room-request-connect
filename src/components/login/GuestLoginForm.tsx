
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestLoginFormProps {
  guestCredentials: {
    roomCode: string;
    roomNumber: string;
  };
  setGuestCredentials: React.Dispatch<React.SetStateAction<{
    roomCode: string;
    roomNumber: string;
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
        Enter your room code to access services
      </CardDescription>
    </CardHeader>
    <form onSubmit={handleGuestLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input
            id="roomNumber"
            type="text"
            placeholder="e.g. 101"
            value={guestCredentials.roomNumber}
            onChange={(e) =>
              setGuestCredentials({
                ...guestCredentials,
                roomNumber: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomCode">Room Access Code</Label>
          <Input
            id="roomCode"
            type="text"
            placeholder="Enter the code provided by your hotel"
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
