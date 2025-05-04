
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context";
import { UserRole } from "@/context/auth/types";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
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
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Short timeout to allow auth state to be checked
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

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
    // Store the path they were trying to visit so we can redirect after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
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
