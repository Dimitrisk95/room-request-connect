
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { User } from "@/types";

interface ProfileSettingsProps {
  user: User | null;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          View and update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user?.name || ""}
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              <span className="capitalize">{user?.role || ""}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
