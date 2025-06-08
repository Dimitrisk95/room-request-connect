
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { RateLimitProvider } from "./components/security/RateLimitProvider";
import { AccessibilityProvider } from "./components/accessibility/AccessibilityProvider";
import { PWAProvider } from "./components/pwa/PWAProvider";
import { OfflineProvider, registerServiceWorker } from "./components/offline/OfflineProvider";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setIsAuthenticated(!!auth.user);
      setLoading(false);
    };

    checkAuth();
  }, [auth.user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <ErrorBoundary>
      <OfflineProvider>
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
                        <ProtectedRoute>
                          <RoomManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/staff-management"
                      element={
                        <ProtectedRoute>
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
                        <ProtectedRoute>
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
                        <ProtectedRoute>
                          <HotelSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/role-management"
                      element={
                        <ProtectedRoute>
                          <RoleManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/access-codes"
                      element={
                        <ProtectedRoute>
                          <AccessCodes />
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
      </OfflineProvider>
    </ErrorBoundary>
  );
};

export default App;
