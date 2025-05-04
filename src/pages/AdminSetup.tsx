
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import SetupWizard from "@/components/admin/SetupWizard";

const AdminSetup = () => {
  const { user, isAuthenticated } = useAuth();
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-lg">
        <header className="py-6">
          <h1 className="text-2xl font-bold text-center">Welcome to Room Request Connect</h1>
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
