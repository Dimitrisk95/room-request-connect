
import { useState } from "react";
import { useAuth } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Shield, UserPlus, Bed } from "lucide-react";
import DashboardShell from "@/components/ui/dashboard-shell";
import HotelSettings from "@/components/admin/HotelSettings";
import RoleManagement from "@/components/admin/RoleManagement";
import HotelCreation from "@/components/admin/HotelCreation";
import HotelRoomManagement from "@/components/admin/HotelRoomManagement";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("hotel-creation");

  if (user?.role !== "admin") {
    return (
      <DashboardShell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Only administrators can access the admin dashboard.</p>
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;
