
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel } from "lucide-react";
import DrawerNavigation from "@/components/DrawerNavigation";
import { useLogin } from "@/hooks/use-login";
import StaffLoginForm from "@/components/login/StaffLoginForm";
import LoginError from "@/components/login/LoginError";

const Login = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    loginError,
    handleStaffLogin,
    isAuthenticated,
    user,
  } = useLogin();

  const [staffCredentials, setStaffCredentials] = useState({
    email: "",
    password: "",
  });

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStaffLogin({
      ...staffCredentials,
      hotelCode: "" // Pass empty string since we're removing the field
    });
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "guest") {
        navigate(`/guest/${user.hotelId}/${user.roomNumber}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <DrawerNavigation />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hotel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Roomlix</h1>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Staff Login
            </h2>
            <p className="text-muted-foreground">
              Login to manage your hotel services
            </p>
          </div>

          {loginError && <LoginError error={loginError} />}

          <StaffLoginForm
            staffCredentials={staffCredentials}
            setStaffCredentials={setStaffCredentials}
            isLoading={isLoading}
            handleStaffLogin={handleStaffLoginSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
