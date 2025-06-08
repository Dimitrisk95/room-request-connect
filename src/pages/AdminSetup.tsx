
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";

const AdminSetup = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Always redirect to dashboard immediately
    navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default AdminSetup;
