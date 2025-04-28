
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context";
import { UserRole } from "@/context/auth/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiresRoomManage?: boolean;
  requiresStaffManage?: boolean;
}

const ProtectedRoute = ({ 
  children,
  allowedRoles = ["admin", "staff"],
  requiresRoomManage = false,
  requiresStaffManage = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  console.log("ProtectedRoute - checking permissions:", {
    isAuthenticated,
    role: user?.role,
    can_manage_rooms: user?.can_manage_rooms,
    can_manage_staff: user?.can_manage_staff,
    requiresRoomManage,
    requiresStaffManage
  });

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has permission
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if authenticated but wrong role
    return <Navigate to="/dashboard" replace />;
  }

  // Check for specific permission requirements (except for admins who have all permissions)
  if (user && user.role !== "admin") {
    // Check room management permission if required
    if (requiresRoomManage && !user.can_manage_rooms) {
      console.log("Protected route: Access denied - missing room management permission");
      return <Navigate to="/dashboard" replace />;
    }
    
    // Check staff management permission if required
    if (requiresStaffManage && !user.can_manage_staff) {
      console.log("Protected route: Access denied - missing staff management permission");
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("Protected route: Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
