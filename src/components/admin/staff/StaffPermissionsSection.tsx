
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StaffFormData } from "./types";

interface StaffPermissionsSectionProps {
  formData: StaffFormData;
  onCheckboxChange: (field: keyof Pick<StaffFormData, "can_manage_rooms" | "can_manage_staff">, checked: boolean) => void;
}

export const StaffPermissionsSection = ({ 
  formData, 
  onCheckboxChange 
}: StaffPermissionsSectionProps) => {
  return (
    <div className="border-l pl-6">
      <h4 className="font-medium mb-4">Permissions</h4>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="manage-rooms"
            checked={formData.can_manage_rooms}
            onCheckedChange={(checked) => 
              onCheckboxChange("can_manage_rooms", checked === true)
            }
          />
          <Label htmlFor="manage-rooms">Can manage rooms</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="manage-staff"
            checked={formData.can_manage_staff}
            onCheckedChange={(checked) => 
              onCheckboxChange("can_manage_staff", checked === true)
            }
          />
          <Label htmlFor="manage-staff">Can manage staff</Label>
        </div>
      </div>
    </div>
  );
};
