
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
import { Toaster } from "@/components/ui/toaster";

// Protected route that also checks if hotel setup is required
const ProtectedRoute = ({ children, requiresHotel = false }: { 
  children: React.ReactNode, 
  requiresHotel?: boolean 
}) => {
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
  
  // Admin without hotel - redirect to setup
  if (requiresHotel && auth.user?.role === "admin" && !auth.user?.hotelId) {
    return <Navigate to="/setup" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guest-connect" element={<GuestConnect />} />
          <Route path="/setup" element={<AdminSetup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiresHotel={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute requiresHotel={true}>
                <RoomManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-management"
            element={
              <ProtectedRoute requiresHotel={true}>
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
              <ProtectedRoute requiresHotel={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute requiresHotel={true}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute requiresHotel={true}>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute requiresHotel={true}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotel-settings"
            element={
              <ProtectedRoute requiresHotel={true}>
                <HotelSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-management"
            element={
              <ProtectedRoute requiresHotel={true}>
                <RoleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/access-codes"
            element={
              <ProtectedRoute requiresHotel={true}>
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
  );
};

export default App;
