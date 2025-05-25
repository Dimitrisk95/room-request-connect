
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationOptionsProps {
  onDashboardClick: () => void;
  onManualNavigation: () => void;
}

export const NavigationOptions = ({ onDashboardClick, onManualNavigation }: NavigationOptionsProps) => {
  return (
    <div className="border rounded-md p-6 bg-card">
      <h3 className="font-medium mb-2">Navigation Options</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Go to Dashboard</span>
          <Button 
            variant="default"
            onClick={onDashboardClick}
          >
            Dashboard
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Force Hard Navigation</span>
          <Button 
            variant="secondary" 
            onClick={onManualNavigation}
          >
            Direct URL Navigation
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Current Location</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {window.location.href}
          </span>
        </div>
      </div>
    </div>
  );
};
