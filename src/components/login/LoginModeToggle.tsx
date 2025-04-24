
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import { LoginMode } from "@/hooks/use-login-mode";

interface LoginModeToggleProps {
  currentMode: LoginMode;
  onSwitch: (mode: LoginMode) => void;
}

const LoginModeToggle: React.FC<LoginModeToggleProps> = ({ currentMode, onSwitch }) => {
  return (
    <div className="flex w-full rounded-lg border p-1 mb-6">
      <Button
        variant={currentMode === "staff" ? "default" : "ghost"}
        className="w-full rounded-md"
        onClick={() => onSwitch("staff")}
      >
        <Users className="h-4 w-4 mr-2" />
        Staff Login
      </Button>
      <Button
        variant={currentMode === "guest" ? "default" : "ghost"}
        className="w-full rounded-md"
        onClick={() => onSwitch("guest")}
      >
        <User className="h-4 w-4 mr-2" />
        Guest Connect
      </Button>
    </div>
  );
};

export default LoginModeToggle;
