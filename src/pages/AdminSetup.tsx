
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import SetupWizard from "@/components/admin/SetupWizard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log("AdminSetup: User state", { 
    isAuthenticated, 
    user, 
    hasHotel: !!user?.hotelId,
    currentPath: window.location.pathname
  });

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // If user already has hotel, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.hotelId) {
      console.log("User already has hotel, redirecting to dashboard");
      window.location.replace('/dashboard');
    }
  }, [isAuthenticated, user?.hotelId]);

  if (!isAuthenticated) {
    return null;
  }

  // If user has hotel, show loading while redirecting
  if (user?.hotelId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleDisconnect = async () => {
    console.log("User disconnecting from setup");
    toast({
      title: "Logging out",
      description: "You will be redirected to the home page."
    });
    
    setTimeout(() => {
      logout();
    }, 500);
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
