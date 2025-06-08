
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface MobileHeaderProps {
  onToggleNotifications: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onToggleNotifications }) => {
  return (
    <div className="md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
      <h1 className="text-lg font-bold">Roomlix</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleNotifications}
          className="text-primary-foreground hover:bg-primary-foreground/10 relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
            3
          </Badge>
        </Button>
      </div>
    </div>
  );
};

export default MobileHeader;
