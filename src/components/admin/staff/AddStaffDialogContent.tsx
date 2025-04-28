
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaffFormData } from "./types";
import { StaffPermissionsSection } from "./StaffPermissionsSection";

interface AddStaffDialogContentProps {
  formData: StaffFormData;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCheckboxChange: (field: keyof Pick<StaffFormData, "can_manage_rooms" | "can_manage_staff">, checked: boolean) => void;
}

export const AddStaffDialogContent = ({
  formData,
  isSubmitting,
  onSubmit,
  onInputChange,
  onRoleChange,
  onCheckboxChange,
}: AddStaffDialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>Add New Staff Member</DialogTitle>
        <DialogDescription>
          Create a new account for a staff member. For testing, a temporary password "password123" will be set.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={onRoleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  For testing purposes, the password will be set to "password123"
                </p>
              </div>
            </div>
            
            <StaffPermissionsSection 
              formData={formData} 
              onCheckboxChange={onCheckboxChange} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Staff Member"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
