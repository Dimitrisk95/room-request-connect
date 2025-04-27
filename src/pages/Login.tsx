
import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/use-login";
import { useLoginMode } from "@/hooks/use-login-mode"; 
import { useIsMobile } from "@/hooks/use-mobile";

import DrawerNavigation from "@/components/DrawerNavigation";
import GuestHotelConnectForm from "@/components/login/GuestHotelConnectForm";
import LoginHeader from "@/components/login/LoginHeader";
import LoginError from "@/components/login/LoginError";
import StaffLoginForm from "@/components/login/StaffLoginForm";
import LoginModeToggle from "@/components/login/LoginModeToggle";
import PasswordSetupForm from "@/components/login/PasswordSetupForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    isLoading,
    loginError,
    handleStaffLogin,
    handleGuestLogin,
    resetLoginError,
    isAuthenticated,
    user,
    needsPasswordSetup,
    userEmail,
    handlePasswordSetupComplete
  } = useLogin();
  const { mode, switchMode } = useLoginMode();
  const navigate = useNavigate();
  
  const [staffCredentials, setStaffCredentials] = useState({
    hotelCode: "",
    email: "",
    password: "",
  });

  const handleCombinedGuestConnect = async (hotelCode: string, roomCode: string) => {
    await handleGuestLogin({ hotelCode, roomCode });
  };

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStaffLogin(staffCredentials);
  };

  // If the user needs to set up their password, show the password setup form
  if (needsPasswordSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md px-4">
          <LoginHeader />
          <div className="mt-6">
            <PasswordSetupForm 
              email={userEmail} 
              onComplete={handlePasswordSetupComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      <DrawerNavigation />
      <div className="w-full max-w-md px-4">
        <LoginHeader />
        
        {loginError && <LoginError error={loginError} />}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            Need an account?{" "}
            <button
              className="text-primary underline hover:text-primary/80"
              onClick={() => navigate("/register")}
            >
              Register here
            </button>
          </div>
        </div>
        
        <LoginModeToggle currentMode={mode} onSwitch={switchMode} />
        
        {mode === "guest" ? (
          <GuestHotelConnectForm
            isLoading={isLoading}
            onConnect={handleCombinedGuestConnect}
          />
        ) : (
          <StaffLoginForm
            staffCredentials={staffCredentials}
            setStaffCredentials={setStaffCredentials}
            isLoading={isLoading}
            handleStaffLogin={handleStaffLoginSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
