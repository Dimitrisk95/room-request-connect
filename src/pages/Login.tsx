
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context";
import { Hotel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StaffLoginForm from "@/components/login/StaffLoginForm";
import GuestLoginForm from "@/components/login/GuestLoginForm";
import HotelSelector from "@/components/login/HotelSelector";
import DrawerNavigation from "@/components/DrawerNavigation";
import GuestHotelConnectForm from "@/components/login/GuestHotelConnectForm";
import AdminRegistrationForm from "@/components/login/AdminRegistrationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const { login, loginAsGuest, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [searchParams] = useSearchParams();
  const modeParam = (searchParams.get("mode") === "guest" || searchParams.get("mode") === "staff")
    ? searchParams.get("mode")
    : null;
  const [mode, setMode] = useState<"staff" | "guest" | null>(modeParam as "staff" | "guest" | null);

  useEffect(() => {
    if (!modeParam) {
      navigate("/login?mode=staff", { replace: true });
    } else {
      setMode(modeParam as "staff" | "guest");
    }
  }, [modeParam, navigate]);

  // Check if already authenticated and redirect
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

  const [staffCredentials, setStaffCredentials] = useState({
    hotelCode: "",
    email: "",
    password: "",
  });

  const [guestCredentials, setGuestCredentials] = useState({
    hotelCode: "",
    roomCode: "",
  });

  // State for admin registration
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const isMobile = useIsMobile();

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Attempting staff login for:", staffCredentials.email);
      localStorage.setItem("selectedHotel", staffCredentials.hotelCode);
      await login(
        staffCredentials.email,
        staffCredentials.password,
        staffCredentials.hotelCode
      );
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Staff login error:", error);
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes("not found")) {
          errorMessage = "User account not found. Please register first."; 
        } else if (error.message.includes("profile not found")) {
          errorMessage = "User profile is incomplete. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setLoginError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      localStorage.setItem("selectedHotel", guestCredentials.hotelCode);
      await loginAsGuest(
        guestCredentials.hotelCode,
        guestCredentials.roomCode
      );
      navigate(`/guest/${guestCredentials.hotelCode}/${guestCredentials.roomCode}`);
    } catch (error: any) {
      console.error("Guest login error:", error);
      setLoginError("Invalid hotel or room code. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid hotel or room code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCombinedGuestConnect = async (hotelCode: string, roomCode: string) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      localStorage.setItem("selectedHotel", hotelCode);
      await loginAsGuest(hotelCode, roomCode);
      navigate(`/guest/${hotelCode}/${roomCode}`);
    } catch (error: any) {
      console.error("Guest login error:", error);
      setLoginError("Invalid hotel code or room code. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid hotel code or room code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        handleStaffLogin={handleStaffLogin}
      />
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      <DrawerNavigation />
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <Hotel className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Room Request Connect</h1>
          <p className="text-muted-foreground mt-2">
            Connect with your hotel for a seamless stay
          </p>
        </div>
        
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {loginError}
            </AlertDescription>
          </Alert>
        )}
        
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
