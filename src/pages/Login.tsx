
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Hotel, ArrowLeft } from "lucide-react";
import { useLogin } from "@/hooks/use-login";
import { Button } from "@/components/ui/button";
import StaffLoginForm from "@/components/login/StaffLoginForm";
import LoginError from "@/components/login/LoginError";
import PasswordSetupForm from "@/components/login/PasswordSetupForm";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    isLoading,
    loginError,
    handleStaffLogin,
    isAuthenticated,
    user,
    needsPasswordSetup,
    userEmail,
    handlePasswordSetupComplete
  } = useLogin();

  // Get email, reset, and setup parameters from URL
  const emailParam = searchParams.get('email');
  const isResetMode = searchParams.get('reset') === 'true';
  const isSetupMode = searchParams.get('setup') === 'true';
  
  const [staffCredentials, setStaffCredentials] = useState({
    email: emailParam || "",
    password: "",
  });

  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [passwordSetupEmail, setPasswordSetupEmail] = useState("");

  // Initialize state based on URL parameters
  useEffect(() => {
    if (emailParam) {
      if (isResetMode || isSetupMode) {
        setShowPasswordSetup(true);
        setPasswordSetupEmail(emailParam);
      }
    }
  }, [emailParam, isResetMode, isSetupMode]);

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting login with credentials:", {
      email: staffCredentials.email,
      passwordLength: staffCredentials.password.length,
    });
    
    await handleStaffLogin(staffCredentials);
  };

  useEffect(() => {
    if (isAuthenticated && !needsPasswordSetup && !showPasswordSetup) {
      console.log("User authenticated, redirecting with permissions:", {
        role: user?.role,
        can_manage_rooms: user?.can_manage_rooms,
        can_manage_staff: user?.can_manage_staff
      });
      
      if (user?.role === "guest") {
        navigate(`/guest/${user.hotelId}/${user.roomNumber}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, needsPasswordSetup, showPasswordSetup, navigate, user]);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hotel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Roomlix</h1>
            </div>
            {showPasswordSetup || needsPasswordSetup ? (
              <h2 className="text-xl font-semibold tracking-tight">
                {isResetMode ? "Reset Password" : "Set Up Your Password"}
              </h2>
            ) : (
              <h2 className="text-xl font-semibold tracking-tight">
                Staff Login
              </h2>
            )}
            <p className="text-muted-foreground">
              {showPasswordSetup || needsPasswordSetup
                ? "Create a secure password for your account"
                : "Login to manage your hotel services"}
            </p>
          </div>

          {loginError && <LoginError error={loginError} />}

          {(showPasswordSetup || needsPasswordSetup) ? (
            <PasswordSetupForm
              email={passwordSetupEmail || userEmail}
              isReset={isResetMode} 
              onComplete={() => {
                setShowPasswordSetup(false);
                handlePasswordSetupComplete();
              }}
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
    </div>
  );
};

export default Login;
