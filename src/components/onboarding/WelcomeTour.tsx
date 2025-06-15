
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Hotel, Users, Settings, BarChart3, MessageSquare, X } from "lucide-react";
import { useAuth } from "@/context";

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete, onSkip }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: "Welcome to Roomlix!",
      description: `Hi ${user?.name || 'there'}! Let's take a quick tour of your hotel management system.`,
      icon: <Hotel className="h-8 w-8 text-primary" />,
      features: [
        "Manage rooms and reservations",
        "Handle guest requests",
        "Coordinate with staff",
        "Track analytics and reports"
      ]
    },
    {
      title: "Dashboard Overview",
      description: "Your dashboard gives you a complete overview of your hotel operations.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      features: [
        "Real-time occupancy status",
        "Recent guest requests",
        "Staff notifications",
        "Quick actions for common tasks"
      ]
    },
    {
      title: "Room Management",
      description: "Easily manage all your rooms, their status, and reservations.",
      icon: <Hotel className="h-8 w-8 text-primary" />,
      features: [
        "View room availability",
        "Update room status",
        "Manage reservations",
        "Generate room reports"
      ]
    },
    {
      title: "Staff Coordination",
      description: "Coordinate with your team and manage staff permissions.",
      icon: <Users className="h-8 w-8 text-primary" />,
      features: [
        "Add and manage staff members",
        "Assign roles and permissions",
        "Track staff tasks",
        "Internal messaging"
      ]
    },
    {
      title: "Guest Communication",
      description: "Handle guest requests and provide excellent service.",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      features: [
        "Receive guest requests",
        "Assign tasks to staff",
        "Track request status",
        "Communicate with guests"
      ]
    },
    {
      title: "You're All Set!",
      description: "You're ready to start managing your hotel efficiently with Roomlix.",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      features: [
        "Explore the dashboard",
        "Add your first rooms",
        "Invite staff members",
        "Start receiving guest requests"
      ]
    }
  ];

  const currentStepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <Badge variant="secondary">
                Step {currentStep + 1} of {tourSteps.length}
              </Badge>
            </div>
          </div>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
        
        <div className="flex justify-between p-6 pt-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {!isLastStep && (
              <Button variant="ghost" onClick={onSkip}>
                Skip Tour
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeTour;
