
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimpleSetupWizard from "@/components/admin/setup-wizard/SimpleSetupWizard";

const AdminSetup = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // If user already has a hotel, redirect to dashboard
    if (user?.hotelId) {
      navigate("/dashboard");
      return;
    }

    // If not an admin, redirect to dashboard
    if (user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user already has a hotel, show redirect message
  if (user.hotelId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // If not an admin, show access denied
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              Only administrators can set up hotels. Your current role is {user.role}.
            </CardDescription>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center">
            <Hotel className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Hotel Setup</h1>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Welcome to Hotel Connect</CardTitle>
              <CardDescription>
                Let's set up your hotel so you can start managing rooms, staff, and guest requests.
                This process will only take a few minutes.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <SimpleSetupWizard />
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
