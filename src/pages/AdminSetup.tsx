
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetupWizard from "@/components/admin/SetupWizard";

const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has a hotel, redirect to dashboard
    if (user?.hotelId) {
      navigate("/admin-dashboard");
    }
  }, [user, navigate]);

  return <SetupWizard />;
};

export default AdminSetup;
