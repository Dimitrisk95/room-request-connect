
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface DesktopHeaderProps {
  onToggleNotifications: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onToggleNotifications }) => {
  return (
    <div className="hidden md:flex bg-background border-b p-4 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleNotifications}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
          3
        </Badge>
      </Button>
    </div>
  );
};

export default DesktopHeader;
