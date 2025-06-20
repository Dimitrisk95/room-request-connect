
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Building, User, Bed, Users, CheckCircle } from "lucide-react";

const HotelSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { id: "auth", label: "Sign Up / Login", icon: <User className="h-4 w-4" /> },
    { id: "hotel", label: "Hotel Profile", icon: <Building className="h-4 w-4" /> },
    { id: "rooms", label: "Add Rooms", icon: <Bed className="h-4 w-4" /> },
    { id: "staff", label: "Setup Staff", icon: <Users className="h-4 w-4" /> },
    { id: "complete", label: "Complete", icon: <CheckCircle className="h-4 w-4" /> }
  ];

  const handleGetStarted = () => {
    // Navigate to auth with setup context
    navigate("/auth?setup=true");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Roomlix</span>
          </div>
          
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Setup Your Hotel</h1>
            <p className="text-xl text-muted-foreground">
              Get your hotel up and running on Roomlix in just a few steps
            </p>
          </div>

          {/* Steps */}
          <div className="mb-12">
            <Steps steps={steps} currentStep={currentStep} />
          </div>

          {/* Setup Flow */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="h-6 w-6" />
                Step 1: Create Your Account
              </CardTitle>
              <CardDescription>
                Sign up for a new hotel owner account or login if you already have one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Create your hotel owner account
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Set up your hotel profile (name, address, contact info)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Add your rooms and configure settings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Optionally add staff accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Access your complete hotel dashboard
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button size="lg" onClick={handleGetStarted} className="w-full sm:w-auto">
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits reminder */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Questions? <a href="mailto:support@roomlix.com" className="text-primary hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelSetup;
