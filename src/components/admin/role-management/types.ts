
import { UserRole } from "@/context/auth/types";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
