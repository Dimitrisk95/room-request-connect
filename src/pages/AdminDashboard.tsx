import { useState } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Key, UserPlus, Bed, Calendar, MessageSquare, Settings, BarChart3, Users } from "lucide-react";
import DashboardShell from "@/components/ui/dashboard-shell";
import HotelSettings from "@/components/admin/HotelSettings";
import RoleManagement from "@/components/admin/role-management";
import HotelRoomManagement from "@/components/admin/HotelRoomManagement";
import HotelInfoTab from "@/components/admin/HotelInfoTab";
import AdminReservationManagement from "@/components/admin/AdminReservationManagement";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardOverview from "@/components/admin/DashboardOverview";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  if (!user) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to access the admin dashboard.
              </CardDescription>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </CardHeader>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  if (user?.role !== "admin") {
    return (
      <DashboardShell>
        <div className="p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
              <CardDescription>
                Only administrators can access the admin dashboard. Your current role is {user?.role}.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  // If admin doesn't have a hotel yet, redirect to setup
  if (!user?.hotelId) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Hotel Setup Required</CardTitle>
              <CardDescription>
                You need to set up your hotel before accessing the admin dashboard.
              </CardDescription>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/setup")}
              >
                Set Up Hotel
              </Button>
            </CardHeader>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Complete hotel management and administration
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center">
              <Bed className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Rooms</span>
              <span className="sm:hidden">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Reservations</span>
              <span className="sm:hidden">Book</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Requests</span>
              <span className="sm:hidden">Req</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Staff</span>
              <span className="sm:hidden">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="hotel-info" className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Hotel Info</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Set</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelRoomManagement />
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <AdminReservationManagement />
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guest Requests Management</CardTitle>
                <CardDescription>
                  View and manage all guest requests and service tickets
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button 
                  onClick={() => navigate("/requests")} 
                  className="w-full"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Manage Requests
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                  Manage staff accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 space-y-4">
                <Button 
                  onClick={() => navigate("/staff-management")} 
                  className="w-full"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Manage Staff Accounts
                </Button>
                <Button 
                  onClick={() => navigate("/role-management")} 
                  variant="outline"
                  className="w-full"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Roles & Permissions
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hotel-info" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelInfoTab />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;
