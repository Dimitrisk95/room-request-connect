
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface StaffLoginFormProps {
  staffCredentials: {
    email: string;
    password: string;
  };
  setStaffCredentials: (credentials: { email: string; password: string }) => void;
  isLoading: boolean;
  handleStaffLogin: (e: React.FormEvent) => Promise<void>;
}

const StaffLoginForm: React.FC<StaffLoginFormProps> = ({
  staffCredentials,
  setStaffCredentials,
  isLoading,
  handleStaffLogin,
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        onBackToLogin={() => setShowForgotPassword(false)}
        initialEmail={staffCredentials.email}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the staff portal
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
              placeholder="Enter your password"
              value={staffCredentials.password}
              onChange={(e) =>
                setStaffCredentials({
                  ...staffCredentials,
                  password: e.target.value,
                })
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground p-0"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot your password?
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StaffLoginForm;
