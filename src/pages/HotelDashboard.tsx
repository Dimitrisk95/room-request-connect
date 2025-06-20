
import React, { useState } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Hotel, 
  Bed, 
  Calendar, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RoomsManagement from "@/components/dashboard/RoomsManagement";
import ReservationsManagement from "@/components/dashboard/ReservationsManagement";
import GuestRequestsManagement from "@/components/dashboard/GuestRequestsManagement";
import StaffManagementPage from "@/components/dashboard/StaffManagementPage";
import AnalyticsPage from "@/components/dashboard/AnalyticsPage";
import SettingsPage from "@/components/dashboard/SettingsPage";

const HotelDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: Hotel },
    { id: "rooms", name: "Rooms Management", icon: Bed },
    { id: "reservations", name: "Reservations", icon: Calendar },
    { id: "requests", name: "Guest Requests", icon: MessageSquare },
    { id: "staff", name: "Staff Management", icon: Users },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "rooms":
        return <RoomsManagement />;
      case "reservations":
        return <ReservationsManagement />;
      case "requests":
        return <GuestRequestsManagement />;
      case "staff":
        return <StaffManagementPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Roomlix</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Hotel info */}
          <div className="p-4 border-b bg-blue-50">
            <h3 className="font-semibold text-gray-900">{user?.name || "Hotel Owner"}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {navigation.find(item => item.id === activeSection)?.name || "Dashboard"}
            </h1>
            <div /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HotelDashboard;
