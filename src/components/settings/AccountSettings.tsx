
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, User, Mail, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User as UserType } from "@/types";

interface AccountSettingsProps {
  user: UserType | null;
}

const AccountSettings = ({ user }: AccountSettingsProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const handleUpdateProfile = async () => {
    // This will be implemented later when needed
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };

  const handlePasswordReset = async () => {
    // This will be implemented later when needed
    toast({
      title: "Password reset email sent",
      description: "Check your email for password reset instructions."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your personal account settings and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <Button 
            onClick={handleUpdateProfile}
            className="mt-4"
          >
            Update Profile
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <Button 
            variant="outline" 
            onClick={handlePasswordReset}
            className="flex items-center"
          >
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
        </div>

        {user?.role === 'admin' && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="mr-2 h-4 w-4" />
            Administrator Account
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
