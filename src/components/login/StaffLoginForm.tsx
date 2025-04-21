
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface StaffLoginFormProps {
  staffCredentials: {
    email: string;
    password: string;
    role: "admin" | "staff";
  };
  setStaffCredentials: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    role: "admin" | "staff";
  }>>;
  googleSignupCode: string;
  setGoogleSignupCode: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  handleStaffLogin: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: (e: React.FormEvent) => Promise<void>;
}

const StaffLoginForm: React.FC<StaffLoginFormProps> = ({
  staffCredentials,
  setStaffCredentials,
  googleSignupCode,
  setGoogleSignupCode,
  isLoading,
  handleStaffLogin,
  handleGoogleLogin
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
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full p-2 border rounded-md"
              value={staffCredentials.role}
              onChange={(e) =>
                setStaffCredentials({
                  ...staffCredentials,
                  role: e.target.value as "admin" | "staff",
                })
              }
            >
              <option value="admin">Hotel Management</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="signupCode">Staff Signup Code</Label>
            <Input
              id="signupCode"
              type="text"
              placeholder="Enter hotel signup code"
              value={googleSignupCode}
              onChange={(e) => setGoogleSignupCode(e.target.value)}
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={isLoading || !googleSignupCode}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Connecting..." : "Sign in with Google"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StaffLoginForm;
