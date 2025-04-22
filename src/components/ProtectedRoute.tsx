
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context";
import { UserRole } from "@/context/auth/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ 
  children,
  allowedRoles = ["admin", "staff"]
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has permission
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if authenticated but wrong role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
