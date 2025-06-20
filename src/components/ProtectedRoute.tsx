
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { UserRole } from "@/components/auth/types";
import { Loader } from "lucide-react";
import { PermissionChecker } from "@/utils/permissions";

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
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - checking permissions:", {
    isLoading,
    hasUser: !!user,
    role: user?.role,
    can_manage_rooms: user?.can_manage_rooms,
    can_manage_staff: user?.can_manage_staff,
    requiresRoomManage,
    requiresStaffManage,
    currentPath: location.pathname
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to auth");
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // If roles are specified, check if user has permission
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute: Wrong role, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Check for specific permission requirements (except for admins who have all permissions)
  if (user && !PermissionChecker.isAdmin(user)) {
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
