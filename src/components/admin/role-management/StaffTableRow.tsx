
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, User } from "lucide-react";
import { StaffMember } from "./types";
import { PermissionDescription } from "./PermissionDescription";

interface StaffTableRowProps {
  staff: StaffMember;
  onRoleChange: (staffId: string, newRole: "admin" | "staff") => void;
  onPasswordReset: () => void;
  selectedStaff: StaffMember | null;
  setSelectedStaff: (staff: StaffMember | null) => void;
  newRole: "admin" | "staff";
  setNewRole: (role: "admin" | "staff") => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  handlePasswordReset: () => void;
}

export const StaffTableRow = ({
  staff,
  onRoleChange,
  onPasswordReset,
  selectedStaff,
  setSelectedStaff,
  newRole,
  setNewRole,
  newPassword,
  setNewPassword,
  handlePasswordReset
}: StaffTableRowProps) => {
  return (
    <TableRow key={staff.id}>
      <TableCell className="font-medium">{staff.name}</TableCell>
      <TableCell>{staff.email}</TableCell>
      <TableCell className="flex items-center">
        <RoleIcon role={staff.role} />
        <span className="ml-2 capitalize">{staff.role}</span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        <PermissionDescription role={staff.role} />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <ChangeRoleDialog 
            staff={staff}
            newRole={newRole}
            setNewRole={setNewRole}
            onRoleChange={onRoleChange}
            setSelectedStaff={setSelectedStaff}
          />
          
          <ResetPasswordDialog
            staff={staff}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            onPasswordReset={onPasswordReset}
            handlePasswordReset={handlePasswordReset}
            setSelectedStaff={setSelectedStaff}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

interface RoleIconProps {
  role: string;
}

const RoleIcon = ({ role }: RoleIconProps) => {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4 text-primary" />;
    case "staff":
      return <User className="h-4 w-4 text-indigo-500" />;
    case "guest":
      return <User className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

interface ChangeRoleDialogProps {
  staff: StaffMember;
  newRole: "admin" | "staff";
  setNewRole: (role: "admin" | "staff") => void;
  onRoleChange: (staffId: string, newRole: "admin" | "staff") => void;
  setSelectedStaff: (staff: StaffMember | null) => void;
}

const ChangeRoleDialog = ({ 
  staff, 
  newRole, 
  setNewRole, 
  onRoleChange,
  setSelectedStaff
}: ChangeRoleDialogProps) => {
  return (
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
            You are changing the role for {staff?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select New Role</Label>
            <select
              id="role"
              className="w-full p-2 border rounded-md"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "admin" | "staff")}
            >
              <option value="admin">Administrator</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onRoleChange(staff.id, newRole)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ResetPasswordDialogProps {
  staff: StaffMember;
  newPassword: string;
  setNewPassword: (password: string) => void;
  onPasswordReset: () => void;
  handlePasswordReset: () => void;
  setSelectedStaff: (staff: StaffMember | null) => void;
}

const ResetPasswordDialog = ({ 
  staff, 
  newPassword,
  setNewPassword,
  onPasswordReset,
  handlePasswordReset,
  setSelectedStaff
}: ResetPasswordDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSelectedStaff(staff);
            onPasswordReset();
          }}
        >
          <Key className="h-4 w-4 mr-1" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for {staff?.name}
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
  );
};
