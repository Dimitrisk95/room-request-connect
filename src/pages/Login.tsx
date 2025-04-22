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

const Login = () => {
  const { login, loginAsGuest, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  const [staffCredentials, setStaffCredentials] = useState({
    hotelName: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "staff",
  });

  const [guestCredentials, setGuestCredentials] = useState({
    hotelCode: "",
    roomCode: "",
  });

  const [googleSignupCode, setGoogleSignupCode] = useState("");

  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotel(hotelId);
    localStorage.setItem("selectedHotel", hotelId);
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("selectedHotel", staffCredentials.hotelName);
      await login(
        staffCredentials.email,
        staffCredentials.password,
        staffCredentials.role,
        staffCredentials.hotelName
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

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!googleSignupCode.trim()) {
      toast({
        title: "Staff Signup Code Required",
        description: "Please enter the staff signup code to proceed with Google login.",
        variant: "destructive",
      });
      return;
    }
    
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

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("selectedHotel", guestCredentials.hotelCode);
      await loginAsGuest(
        guestCredentials.hotelCode,
        guestCredentials.roomCode
      );
      navigate(`/guest/${guestCredentials.hotelCode}/${guestCredentials.roomCode}`);
    } catch (error) {
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
    try {
      localStorage.setItem("selectedHotel", hotelCode);
      await loginAsGuest(hotelCode, roomCode);
      navigate(`/guest/${hotelCode}/${roomCode}`);
    } catch (error) {
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
        googleSignupCode={googleSignupCode}
        setGoogleSignupCode={setGoogleSignupCode}
        isLoading={isLoading}
        handleStaffLogin={handleStaffLogin}
        handleGoogleLogin={handleGoogleLogin}
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
        {renderContent()}
      </div>
    </div>
  );
};

export default Login;
