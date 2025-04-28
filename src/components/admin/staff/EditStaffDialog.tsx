
import { Dialog } from "@/components/ui/dialog";
import { EditStaffDialogContent } from "./EditStaffDialogContent";
import { useEditStaffForm } from "./useEditStaffForm";
import { EditStaffDialogProps } from "./types";

export const EditStaffDialog = ({
  open,
  onOpenChange,
  staff,
  onStaffUpdated,
}: EditStaffDialogProps) => {
  const {
    formData,
    isSubmitting,
    handleSubmit,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
  } = useEditStaffForm(staff, onStaffUpdated, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <EditStaffDialogContent
        formData={formData}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onRoleChange={handleRoleChange}
        onCheckboxChange={handleCheckboxChange}
      />
    </Dialog>
  );
};
