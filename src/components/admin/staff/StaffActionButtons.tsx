
import { Button } from "@/components/ui/button";
import { StaffMember } from "@/types";
import { Trash2, Edit, RotateCcw } from "lucide-react";

interface StaffActionButtonsProps {
  staff: StaffMember;
  onPasswordReset: (staff: StaffMember) => void;
  onDeleteClick: (staff: StaffMember) => void;
  onEditClick: (staff: StaffMember) => void;
  currentUserId: string;
}

export const StaffActionButtons = ({
  staff,
  onPasswordReset,
  onDeleteClick,
  onEditClick,
  currentUserId,
}: StaffActionButtonsProps) => {
  // Check if this is the current user's account
  const isSelf = staff.id === currentUserId;
  
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
      
      {/* Always show password reset except for self (admins should use account settings) */}
      {!isSelf && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPasswordReset(staff)}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset Password
        </Button>
      )}
      
      {/* Don't allow users to delete themselves */}
      {!isSelf && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteClick(staff)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
};
