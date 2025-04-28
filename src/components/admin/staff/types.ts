
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
