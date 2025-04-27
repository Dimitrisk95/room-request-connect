
import { Button } from "@/components/ui/button";
import { StaffMember } from "@/types";
import { Key, Trash2, Edit } from "lucide-react";

interface StaffActionButtonsProps {
  staff: StaffMember;
  onPasswordReset: (staff: StaffMember) => void;
  onDeleteClick: (staff: StaffMember) => void;
  onEditClick: (staff: StaffMember) => void;
}

export const StaffActionButtons = ({
  staff,
  onPasswordReset,
  onDeleteClick,
  onEditClick,
}: StaffActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEditClick(staff)}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPasswordReset(staff)}
      >
        <Key className="h-4 w-4 mr-1" />
        Reset Password
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDeleteClick(staff)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
};
