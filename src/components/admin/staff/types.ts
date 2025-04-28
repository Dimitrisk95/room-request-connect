
export interface StaffFormData {
  name: string;
  email: string;
  role: "admin" | "staff";
  can_manage_rooms: boolean;
  can_manage_staff: boolean;
}

export interface AddStaffDialogProps {
  onStaffAdded: () => void;
}

export interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  onStaffUpdated: () => void;
}

// Interface for the staff form hook when used for editing
export interface UseEditStaffFormReturn {
  formData: Partial<StaffMember>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckboxChange: (field: keyof Pick<StaffFormData, "can_manage_rooms" | "can_manage_staff">, checked: boolean) => void;
}
