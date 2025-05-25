
import { Check } from "lucide-react";

interface CompletionHeaderProps {
  debugMode: boolean;
  hotelCreated: boolean;
}

export const CompletionHeader = ({ debugMode, hotelCreated }: CompletionHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center">
        <div className="bg-primary/10 p-3 rounded-full">
          <Check className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h2 className="text-2xl font-bold">Setup Complete!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        {debugMode 
          ? "Debug mode: Create hotel simulation. Click buttons below to test redirect."
          : hotelCreated 
            ? "Your hotel has been set up successfully. You will be redirected to your dashboard automatically."
            : "Review your information and click the button below to complete setup and create your hotel."}
      </p>
    </div>
  );
};
