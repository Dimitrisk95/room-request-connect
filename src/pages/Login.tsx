
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/use-login";
import { useLoginMode } from "@/hooks/use-login-mode"; 
import { useIsMobile } from "@/hooks/use-mobile";

import DrawerNavigation from "@/components/DrawerNavigation";
import GuestHotelConnectForm from "@/components/login/GuestHotelConnectForm";
import AdminRegistrationForm from "@/components/login/AdminRegistrationForm";
import LoginHeader from "@/components/login/LoginHeader";
import LoginError from "@/components/login/LoginError";
import StaffLoginForm from "@/components/login/StaffLoginForm";
import LoginModeToggle from "@/components/login/LoginModeToggle";
import HotelRegisterDialog from "@/components/login/HotelRegisterDialog";

const Login = () => {
  const {
    isLoading,
    loginError,
    handleStaffLogin,
    handleGuestLogin,
    resetLoginError,
    isAuthenticated,
    user
  } = useLogin();
  const { mode } = useLoginMode();
  const navigate = useNavigate();
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const isMobile = useIsMobile();
  
  const [staffCredentials, setStaffCredentials] = useState({
    hotelCode: "",
    email: "",
    password: "",
  });

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

  const handleShowAdminRegister = () => {
    resetLoginError();
    setShowAdminRegister(true);
  };

  const handleHideAdminRegister = () => {
    setShowAdminRegister(false);
  };

  const renderContent = () => {
    if (showAdminRegister && !isMobile) {
      return (
        <AdminRegistrationForm
          onRegistered={() => setShowAdminRegister(false)}
          onCancel={handleHideAdminRegister}
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
        
        {loginError && <LoginError error={loginError} />}
        
        {!isMobile && mode === "staff" && !showAdminRegister && (
          <div className="flex justify-between items-center mb-4">
            <HotelRegisterDialog />
            <button
              className="text-primary underline text-sm hover:text-primary/80"
              onClick={handleShowAdminRegister}
            >
              Register as Admin
            </button>
          </div>
        )}
        
        {!showAdminRegister && <LoginModeToggle currentMode={mode} onSwitch={(newMode) => navigate(`/login?mode=${newMode}`)} />}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Login;
