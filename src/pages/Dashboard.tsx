
import { useAuth } from "@/context";
import { useOnboarding } from "@/hooks/auth/use-onboarding";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import WelcomeTour from "@/components/onboarding/WelcomeTour";

const Dashboard = () => {
  const { user } = useAuth();
  const { showWelcomeTour, completeOnboarding, skipOnboarding } = useOnboarding();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardContent />
      
      {showWelcomeTour && (
        <WelcomeTour 
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </div>
  );
};

export default Dashboard;
