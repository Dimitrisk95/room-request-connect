
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight, ChevronLeft, MapPin } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  tourType: "admin" | "staff" | "setup";
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, tourType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  useEffect(() => {
    const tourSteps = {
      admin: [
        {
          id: "dashboard",
          title: "Welcome to Your Dashboard",
          content: "This is your main control center. Here you can see occupancy rates, recent requests, and key metrics.",
          target: "[data-tour='dashboard']",
          placement: "bottom" as const
        },
        {
          id: "rooms",
          title: "Room Management",
          content: "Manage all your rooms, check statuses, and handle reservations from this section.",
          target: "[data-tour='rooms']",
          placement: "right" as const
        },
        {
          id: "staff",
          title: "Staff Coordination",
          content: "Assign requests to staff members and track their progress in real-time.",
          target: "[data-tour='staff']",
          placement: "right" as const
        },
        {
          id: "requests",
          title: "Guest Requests",
          content: "Monitor and respond to all guest requests. Prioritize urgent items and assign them to staff.",
          target: "[data-tour='requests']",
          placement: "right" as const
        },
        {
          id: "analytics",
          title: "Analytics & Reports",
          content: "View detailed analytics about your hotel's performance, guest satisfaction, and operational efficiency.",
          target: "[data-tour='analytics']",
          placement: "right" as const
        }
      ],
      staff: [
        {
          id: "assignments",
          title: "Your Assignments",
          content: "See all requests assigned to you. Click on any request to view details and update status.",
          target: "[data-tour='assignments']",
          placement: "bottom" as const
        },
        {
          id: "requests",
          title: "All Requests",
          content: "View all hotel requests. You can pick up unassigned requests if you have capacity.",
          target: "[data-tour='requests']",
          placement: "right" as const
        },
        {
          id: "schedule",
          title: "Today's Schedule",
          content: "Your schedule for today, including assigned rooms and maintenance tasks.",
          target: "[data-tour='schedule']",
          placement: "left" as const
        }
      ],
      setup: [
        {
          id: "hotel-info",
          title: "Hotel Information",
          content: "Start by entering your hotel's basic information. This will be used throughout the system.",
          target: "[data-tour='hotel-info']",
          placement: "bottom" as const
        },
        {
          id: "rooms-setup",
          title: "Room Configuration",
          content: "Add your rooms with details like capacity, type, and floor. You can add them one by one or in bulk.",
          target: "[data-tour='rooms-setup']",
          placement: "bottom" as const
        },
        {
          id: "staff-setup",
          title: "Staff Members",
          content: "Invite your staff members and set their permissions. They'll receive an email to set up their password.",
          target: "[data-tour='staff-setup']",
          placement: "bottom" as const
        },
        {
          id: "completion",
          title: "You're All Set!",
          content: "Congratulations! Your hotel is now set up and ready to use. You'll be redirected to your dashboard.",
          target: "[data-tour='completion']",
          placement: "top" as const
        }
      ]
    };

    setSteps(tourSteps[tourType]);
  }, [tourType]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{currentStepData.title}</h3>
            <p className="text-muted-foreground">{currentStepData.content}</p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="ghost" onClick={skipTour}>
              Skip Tour
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTour;
