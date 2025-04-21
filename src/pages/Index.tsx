
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

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
    <div className="min-h-screen bg-background relative">
      {/* Top right corner button */}
      <div className="absolute top-4 right-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/login")}
          className="text-primary-foreground"
        >
          Staff Login
        </Button>
      </div>

      {/* Centered connect button */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <Button
          size="lg"
          onClick={() => navigate("/login")}
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Connect to Your Room
        </Button>
      </div>
    </div>
  );
};

export default Index;
