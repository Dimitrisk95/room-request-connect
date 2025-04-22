
import { useState } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, ShieldCheck, Key, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/context/auth/types";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

// Mock data - in a real app this would come from an API
const mockStaffMembers: StaffMember[] = [
  { id: "1", name: "John Doe", email: "john@hotel.com", role: "admin" },
  { id: "2", name: "Jane Smith", email: "jane@hotel.com", role: "staff" },
  { id: "3", name: "Alice Johnson", email: "alice@hotel.com", role: "staff" },
  { id: "4", name: "Bob Williams", email: "bob@hotel.com", role: "staff" },
];

const RoleManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("staff");
  const [newPassword, setNewPassword] = useState("");

  const handleRoleChange = async (staffId: string, newRole: UserRole) => {
    // In a real app, this would be an API call
    setStaffMembers(staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, role: newRole } : staff
    ));
    
    toast({
      title: "Role updated",
      description: `Staff member's role has been changed to ${newRole}.`,
    });
  };

  const handlePasswordReset = async () => {
    if (!selectedStaff) return;
    
    // In a real app, this would be an API call
    console.log(`Resetting password for ${selectedStaff.name} to: ${newPassword}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Password updated",
      description: `Password has been reset for ${selectedStaff.name}.`,
    });
    
    setNewPassword("");
    setSelectedStaff(null);
  };

  const getPermissionDescription = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Full access to all systems";
      case "staff":
        return "Basic access to handle guest requests";
      case "guest":
        return "Limited access to request services";
      default:
        return "";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-primary" />;
      case "staff":
        return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
      case "guest":
        return <User className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  if (user?.role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Only administrators can manage staff roles.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Staff Role Management
        </CardTitle>
        <CardDescription>
          Manage roles and permissions for your hotel staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell className="flex items-center">
                  {getRoleIcon(staff.role)}
                  <span className="ml-2 capitalize">{staff.role}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {getPermissionDescription(staff.role)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedStaff(staff)}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Change Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Staff Role</DialogTitle>
                          <DialogDescription>
                            You are changing the role for {selectedStaff?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="role">Select New Role</Label>
                            <select
                              id="role"
                              className="w-full p-2 border rounded-md"
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value as UserRole)}
                            >
                              <option value="admin">Administrator</option>
                              <option value="staff">Staff Member</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={() => {
                              if (selectedStaff) {
                                handleRoleChange(selectedStaff.id, newRole);
                              }
                            }}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedStaff(staff)}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          Reset Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>
                            Set a new password for {selectedStaff?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handlePasswordReset}>Reset Password</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
