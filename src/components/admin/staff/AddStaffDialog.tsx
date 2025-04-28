
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { AddStaffDialogContent } from "./AddStaffDialogContent";
import { useStaffForm } from "./useStaffForm";
import { AddStaffDialogProps } from "./types";

export const AddStaffDialog = ({ onStaffAdded }: AddStaffDialogProps) => {
  const {
    formData,
    isSubmitting,
    open,
    setOpen,
    handleSubmit,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
  } = useStaffForm(onStaffAdded);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <AddStaffDialogContent
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
