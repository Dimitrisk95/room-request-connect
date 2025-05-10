
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

  // Debugging
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

  // If the admin already has a hotel, redirect to dashboard 
  // This now uses a direct window.location approach rather than React Router
  useEffect(() => {
    if (user?.hotelId) {
      console.log("User already has hotel, forcing redirect to dashboard");
      const timestamp = new Date().getTime();
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        // Force hard navigation to dashboard
        window.location.href = `/dashboard?t=${timestamp}`;
      }, 100);
    }
  }, [user?.hotelId]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting to login
  }

  const handleDisconnect = async () => {
    console.log("User disconnecting from setup");
    toast({
      title: "Logging out",
      description: "You will be redirected to the home page."
    });
    
    // Add a slight delay to show the toast
    setTimeout(() => {
      logout(); // This will redirect to home page as defined in AuthProvider.tsx
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
