
import { useState } from "react";
import { useAuth } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Key, UserPlus, Bed } from "lucide-react";
import DashboardShell from "@/components/ui/dashboard-shell";
import HotelSettings from "@/components/admin/HotelSettings";
import RoleManagement from "@/components/admin/role-management";
import HotelCreation from "@/components/admin/HotelCreation";
import HotelRoomManagement from "@/components/admin/HotelRoomManagement";
import HotelInfoTab from "@/components/admin/HotelInfoTab";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("hotel-creation");
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

  return (
    <DashboardShell>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your hotel settings, rooms, and staff roles
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="hotel-creation" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create Hotel</span>
              <span className="sm:hidden">Create</span>
            </TabsTrigger>
            <TabsTrigger value="hotel-settings" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Hotel Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="hotel-info" className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Hotel Info</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="room-management" className="flex items-center">
              <Bed className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Room Management</span>
              <span className="sm:hidden">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="staff-management" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Staff Management</span>
              <span className="sm:hidden">Staff</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotel-creation" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelCreation />
            </div>
          </TabsContent>

          <TabsContent value="hotel-settings" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelSettings />
            </div>
          </TabsContent>

          <TabsContent value="hotel-info" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelInfoTab />
            </div>
          </TabsContent>

          <TabsContent value="room-management" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              <HotelRoomManagement />
            </div>
          </TabsContent>

          <TabsContent value="staff-management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                  To manage staff accounts, please go to the staff management page
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button 
                  onClick={() => navigate("/staff-management")} 
                  className="w-full"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Go to Staff Management
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;
