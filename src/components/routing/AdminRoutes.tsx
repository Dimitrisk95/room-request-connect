
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminRooms from "@/pages/AdminRooms";
import HotelSettings from "@/pages/HotelSettings";
import RoleManagement from "@/pages/RoleManagement";
import AccessCodes from "@/pages/AccessCodes";
import Analytics from "@/pages/Analytics";

export const AdminRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotel-settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <HotelSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/role-management"
        element={
          <ProtectedRoute requiresStaffManage={true}>
            <RoleManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/access-codes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AccessCodes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />
    </>
  );
};
