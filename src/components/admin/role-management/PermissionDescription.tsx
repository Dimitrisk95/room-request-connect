
import { UserRole } from "@/context/auth/types";

interface PermissionDescriptionProps {
  role: UserRole;
}

export const PermissionDescription = ({ role }: PermissionDescriptionProps) => {
  switch (role) {
    case "admin":
      return "Full access to all systems";
    case "staff":
      return "Basic access to handle guest requests";
    case "guest":
      return "Limited access to request services";
    default:
      return "";
  }
};
