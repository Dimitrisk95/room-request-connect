
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import SetupWizard from "@/components/admin/SetupWizard";

const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If the admin already has a hotel, redirect to dashboard
  useEffect(() => {
    if (user?.hotelId) {
      navigate("/dashboard");
    }
  }, [user?.hotelId, navigate]);

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
