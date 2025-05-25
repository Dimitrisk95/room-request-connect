
import { Bug } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DebugModeAlertProps {
  debugMode: boolean;
}

export const DebugModeAlert = ({ debugMode }: DebugModeAlertProps) => {
  if (!debugMode) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <Bug className="h-4 w-4" />
      <AlertTitle>Debug Mode Active</AlertTitle>
      <AlertDescription>
        You are in debug mode. Hotel creation is simulated and no data is saved to the database.
        You can safely test the navigation behavior.
      </AlertDescription>
    </Alert>
  );
};
