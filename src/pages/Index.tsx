
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Hotel } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (user?.role === "guest") {
        navigate(`/guest/${user.roomNumber}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Top section with logo and login button */}
      <div className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Room Request Connect</h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/login?tab=staff")}
          className="border-primary text-primary hover:bg-primary/10"
        >
          Staff Login
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to our Hotel Services</h2>
        <p className="text-gray-600 max-w-md mb-8">
          Connect to your room to make service requests, view hotel information, and enjoy your stay.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/login?tab=guest")}
          className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg"
        >
          Connect to Your Room
        </Button>
      </div>

      {/* Footer */}
      <div className="w-full p-4 text-center text-gray-500 text-sm">
        © 2025 Room Request Connect - Making your stay comfortable
      </div>
    </div>
  );
};

export default Index;
