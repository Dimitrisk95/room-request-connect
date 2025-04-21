
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Hotel, MessageSquare, Bell, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <div className="flex justify-center h-16 w-16 rounded-full bg-primary-foreground/10 text-primary-foreground items-center mb-6">
                <Hotel className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Room Request Connect
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto text-primary-foreground/80">
                Streamline communication between guests, hotel staff, and management
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Connect to Your Room
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Effortless Hotel Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A unified platform that connects guests, staff, and management for a seamless hotel experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Requests</h3>
            <p className="text-muted-foreground">
              Guests can submit service requests directly from their mobile devices, eliminating phone calls and wait times
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Staff Coordination</h3>
            <p className="text-muted-foreground">
              Assign and track tasks among staff members, ensuring accountability and efficient service delivery
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reservation Management</h3>
            <p className="text-muted-foreground">
              Track room bookings, check-ins, and check-outs with an integrated calendar system
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-muted">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your hotel experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hotels worldwide that are using Room Request Connect to improve guest satisfaction and operational efficiency
            </p>
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started Today
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Hotel className="h-6 w-6 mr-2" />
              <span className="font-bold">Room Request Connect</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 Room Request Connect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
