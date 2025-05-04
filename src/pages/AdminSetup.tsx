
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import SetupWizard from "@/components/admin/SetupWizard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminSetup = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Debugging
  console.log("AdminSetup: User state", { 
    isAuthenticated, 
    user, 
    hasHotel: !!user?.hotelId 
  });

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // If the admin already has a hotel, redirect to dashboard
  useEffect(() => {
    if (user?.hotelId) {
      console.log("User already has hotel, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [user?.hotelId, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting to login
  }

  const handleDisconnect = () => {
    console.log("User disconnecting from setup");
    logout(); // This will redirect to home page as defined in AuthProvider.tsx
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-lg">
        <header className="py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Welcome to Roomlix</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Disconnect
            </Button>
          </div>
          <p className="text-center text-muted-foreground">
            Let's set up your hotel to get started
          </p>
        </header>
        <SetupWizard />
      </div>
    </div>
  );
};

export default AdminSetup;
