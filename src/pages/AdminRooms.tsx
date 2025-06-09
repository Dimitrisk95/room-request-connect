
import DashboardShell from "@/components/ui/dashboard-shell";
import HotelRoomManagement from "@/components/admin/HotelRoomManagement";
import { useAuth } from "@/context";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminRooms = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to access the admin rooms page.
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
                Only administrators can access the rooms management page. Your current role is {user?.role}.
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
        <HotelRoomManagement />
      </div>
    </DashboardShell>
  );
};

export default AdminRooms;
