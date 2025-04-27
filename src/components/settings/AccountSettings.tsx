
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, User, Mail, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User as UserType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AccountSettingsProps {
  user: UserType | null;
}

const AccountSettings = ({ user }: AccountSettingsProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    try {
      // Update the user's name in the database
      const { error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    
    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordError(error.message || "Failed to update password");
      
      toast({
        title: "Failed to update password",
        description: error.message || "An error occurred while updating your password.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
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
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed. Contact your administrator for email changes.
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleUpdateProfile}
            className="mt-4"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? "Updating..." : "Update Profile"}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={8}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>

            <Button 
              onClick={handlePasswordChange} 
              variant="outline"
              className="flex items-center"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
            >
              <Key className="mr-2 h-4 w-4" />
              {isUpdatingPassword ? "Updating Password..." : "Change Password"}
            </Button>
          </div>
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
