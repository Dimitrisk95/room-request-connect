
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel } from "lucide-react";
import DrawerNavigation from "@/components/DrawerNavigation";
import { useLogin } from "@/hooks/use-login";
import AdminLoginForm from "@/components/login/AdminLoginForm";
import LoginError from "@/components/login/LoginError";

const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    loginError,
    isAuthenticated,
    user,
    needsPasswordSetup,
    userEmail,
    handlePasswordSetupComplete
  } = useLogin();
  
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
              Hotel Admin Portal
            </h2>
            <p className="text-muted-foreground">
              Login to manage your hotel properties
            </p>
          </div>

          {loginError && <LoginError error={loginError} />}

          <AdminLoginForm
            onSuccess={() => navigate("/admin")}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
