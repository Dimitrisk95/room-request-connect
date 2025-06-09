
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import RoomManagement from "@/pages/RoomManagement";
import StaffManagement from "@/pages/StaffManagement";
import Settings from "@/pages/Settings";
import Calendar from "@/pages/Calendar";
import Requests from "@/pages/Requests";
import RequestDetails from "@/pages/RequestDetails";
import Staff from "@/pages/Staff";

export const ProtectedRoutes: React.FC = () => {
  return (
    <>
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
    </>
  );
};
