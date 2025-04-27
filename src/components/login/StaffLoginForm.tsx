
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface StaffLoginFormProps {
  staffCredentials: {
    email: string;
    password: string;
  };
  setStaffCredentials: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>;
  isLoading: boolean;
  handleStaffLogin: (e: React.FormEvent) => Promise<void>;
}

const StaffLoginForm: React.FC<StaffLoginFormProps> = ({
  staffCredentials,
  setStaffCredentials,
  isLoading,
  handleStaffLogin
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Login</CardTitle>
        <CardDescription>
          Login to manage your hotel's rooms and requests
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleStaffLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={staffCredentials.email}
              onChange={(e) =>
                setStaffCredentials({
                  ...staffCredentials,
                  email: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={staffCredentials.password}
              onChange={(e) =>
                setStaffCredentials({
                  ...staffCredentials,
                  password: e.target.value,
                })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              First time login? Contact your administrator to set up your password.
            </p>
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StaffLoginForm;
