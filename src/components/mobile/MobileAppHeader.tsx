
import React from 'react';
import { useAuth } from '@/context';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileAppHeaderProps {
  title: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MobileAppHeader: React.FC<MobileAppHeaderProps> = ({
  title,
  onMenuClick,
  onNotificationClick,
  showBackButton = false,
  onBackClick
}) => {
  const { user } = useAuth();

  return (
    <div className="md:hidden bg-primary text-primary-foreground sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              ←
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {user?.name && (
              <p className="text-sm text-primary-foreground/80">Welcome, {user.name}</p>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationClick}
          className="text-primary-foreground hover:bg-primary-foreground/10 relative"
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

export default MobileAppHeader;
