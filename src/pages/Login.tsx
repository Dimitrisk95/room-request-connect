
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Hotel } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StaffLoginForm from "@/components/login/StaffLoginForm";
import GuestLoginForm from "@/components/login/GuestLoginForm";
import DrawerNavigation from "@/components/DrawerNavigation";

const Login = () => {
  const { login, loginAsGuest, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Handle query param (mode) to determine current form
  const [searchParams] = useSearchParams();
  const modeParam = (searchParams.get("mode") === "guest" || searchParams.get("mode") === "staff")
    ? searchParams.get("mode")
    : null;
  const [mode, setMode] = useState<"staff" | "guest" | null>(modeParam as "staff" | "guest" | null);

  useEffect(() => {
    if (!modeParam) {
      // If mode is missing or invalid, redirect to default (staff)
      navigate("/login?mode=staff", { replace: true });
    } else {
      setMode(modeParam as "staff" | "guest");
    }
    // eslint-disable-next-line
  }, [modeParam, navigate]);

  // Staff login form state
  const [staffCredentials, setStaffCredentials] = useState({
    email: "",
    password: "",
    role: "admin" as "admin" | "staff",
  });

  // Guest login form state
  const [guestCredentials, setGuestCredentials] = useState({
    roomCode: "",
    roomNumber: "",
  });

  // Google signup with code
  const [googleSignupCode, setGoogleSignupCode] = useState("");

  // Handle staff login
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(
        staffCredentials.email,
        staffCredentials.password,
        staffCredentials.role
      );
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithGoogle(googleSignupCode);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid signup code or Google authentication failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest login
  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginAsGuest(
        guestCredentials.roomCode,
        guestCredentials.roomNumber
      );
      navigate(`/guest/${guestCredentials.roomCode}`);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid room code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
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
        {mode === "staff" && (
          <>
            <StaffLoginForm
              staffCredentials={staffCredentials}
              setStaffCredentials={setStaffCredentials}
              googleSignupCode={googleSignupCode}
              setGoogleSignupCode={setGoogleSignupCode}
              isLoading={isLoading}
              handleStaffLogin={handleStaffLogin}
              handleGoogleLogin={handleGoogleLogin}
            />
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p>Admin: admin@hotel.com / admin123</p>
              <p>Staff: staff@hotel.com / staff123</p>
              <p>Guest: Room 101 / Code: 123456</p>
            </div>
          </>
        )}
        {mode === "guest" && (
          <GuestLoginForm
            guestCredentials={guestCredentials}
            setGuestCredentials={setGuestCredentials}
            isLoading={isLoading}
            handleGuestLogin={handleGuestLogin}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
