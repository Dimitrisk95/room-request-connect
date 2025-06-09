
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import all pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import GuestConnect from "@/pages/GuestConnect";
import AdminSetup from "@/pages/AdminSetup";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import GuestView from "@/pages/GuestView";
import Dashboard from "@/pages/Dashboard";
import RoomManagement from "@/pages/RoomManagement";
import StaffManagement from "@/pages/StaffManagement";
import Settings from "@/pages/Settings";
import Calendar from "@/pages/Calendar";
import Requests from "@/pages/Requests";
import RequestDetails from "@/pages/RequestDetails";
import Staff from "@/pages/Staff";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminRooms from "@/pages/AdminRooms";
import HotelSettings from "@/pages/HotelSettings";
import RoleManagement from "@/pages/RoleManagement";
import AccessCodes from "@/pages/AccessCodes";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/NotFound";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/guest-connect" element={<GuestConnect />} />
      <Route path="/setup" element={<AdminSetup />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Guest Routes */}
      <Route path="/guest/:roomCode" element={<GuestView />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute requiresRoomManage={true}>
            <RoomManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-management"
        element={
          <ProtectedRoute requiresStaffManage={true}>
            <StaffManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request/:id"
        element={
          <ProtectedRoute>
            <RequestDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
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

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
