
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader, Key } from "lucide-react";
import { useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";

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
          Login to manage your hotel's rooms and requests
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleStaffLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-primary" 
                type="button"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              For newly created staff accounts, use the password "password123" unless you've reset it.
            </p>
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> 
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StaffLoginForm;
