
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./SimpleAuthProvider";
import { PermissionChecker } from "@/utils/permissions";

export const AuthRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      console.log('AuthRedirect: User authenticated, redirecting', { 
        role: user.role, 
        hotelId: user.hotelId 
      });
      
      if (user.role === "guest" && user.roomNumber) {
        navigate(`/guest/${user.roomNumber}`, { replace: true });
      } else if (PermissionChecker.isAdmin(user)) {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return null;
};
