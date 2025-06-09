
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context";
import { useAuth } from "./context";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RoomManagement from "./pages/RoomManagement";
import StaffManagement from "./pages/StaffManagement";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRooms from "./pages/AdminRooms";
import Calendar from "./pages/Calendar";
import Requests from "./pages/Requests";
import Staff from "./pages/Staff";
import HotelSettings from "./pages/HotelSettings";
import RoleManagement from "./pages/RoleManagement";
import AccessCodes from "./pages/AccessCodes";
import NotFound from "./pages/NotFound";
import GuestView from "./pages/GuestView";
import AdminSetup from "./pages/AdminSetup";
import GuestConnect from "./pages/GuestConnect";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RequestDetails from "./pages/RequestDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { RateLimitProvider } from "./components/security/RateLimitProvider";
import { AccessibilityProvider } from "./components/accessibility/AccessibilityProvider";
import { PWAProvider } from "./components/pwa/PWAProvider";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <AccessibilityProvider>
          <RateLimitProvider>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/guest-connect" element={<GuestConnect />} />
                  <Route path="/setup" element={<AdminSetup />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
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
                    path="/admin/rooms"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminRooms />
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
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
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
                  <Route 
                    path="/guest/:roomCode" 
                    element={<GuestView />} 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </AuthProvider>
            </Router>
          </RateLimitProvider>
        </AccessibilityProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
};

export default App;
