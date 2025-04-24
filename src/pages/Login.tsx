
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "@/hooks/use-login";
import DrawerNavigation from "@/components/DrawerNavigation";
import GuestHotelConnectForm from "@/components/login/GuestHotelConnectForm";
import AdminRegistrationForm from "@/components/login/AdminRegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import LoginHeader from "@/components/login/LoginHeader";
import LoginError from "@/components/login/LoginError";
import StaffLoginForm from "@/components/login/StaffLoginForm";

const Login = () => {
  const {
    isLoading,
    loginError,
    handleStaffLogin,
    handleGuestLogin,
    isAuthenticated,
    user
  } = useLogin();
  const navigate = useNavigate();
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const isMobile = useIsMobile();
  
  const [searchParams] = useSearchParams();
  const modeParam = (searchParams.get("mode") === "guest" || searchParams.get("mode") === "staff")
    ? searchParams.get("mode")
    : null;
  const [mode, setMode] = useState<"staff" | "guest" | null>(modeParam as "staff" | "guest" | null);

  const [staffCredentials, setStaffCredentials] = useState({
    hotelCode: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!modeParam) {
      navigate("/login?mode=staff", { replace: true });
    } else {
      setMode(modeParam as "staff" | "guest");
    }
  }, [modeParam, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting");
      if (user?.role === "guest") {
        navigate(`/guest/${user.hotelId}/${user.roomNumber}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleCombinedGuestConnect = async (hotelCode: string, roomCode: string) => {
    await handleGuestLogin({ hotelCode, roomCode });
  };

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStaffLogin(staffCredentials);
  };

  const renderContent = () => {
    if (showAdminRegister && !isMobile) {
      return (
        <AdminRegistrationForm
          onRegistered={() => setShowAdminRegister(false)}
          onCancel={() => setShowAdminRegister(false)}
        />
      );
    }

    if (mode === "guest") {
      return (
        <GuestHotelConnectForm
          isLoading={isLoading}
          onConnect={handleCombinedGuestConnect}
        />
      );
    }

    return (
      <StaffLoginForm
        staffCredentials={staffCredentials}
        setStaffCredentials={setStaffCredentials}
        isLoading={isLoading}
        handleStaffLogin={handleStaffLoginSubmit}
      />
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      <DrawerNavigation />
      <div className="w-full max-w-md px-4">
        <LoginHeader />
        <LoginError error={loginError} />
        
        {!isMobile && !showAdminRegister && (
          <div className="mb-4 flex justify-end">
            <button
              className="text-primary underline text-sm hover:text-primary/80"
              onClick={() => setShowAdminRegister(true)}
            >
              Register as Admin
            </button>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default Login;
