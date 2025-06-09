
import React, { ReactNode } from 'react';
import MobileAppHeader from './MobileAppHeader';
import MobileBottomNav from './MobileBottomNav';
import { useNavigate } from 'react-router-dom';

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onNotificationClick?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onNotificationClick
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="md:hidden min-h-screen bg-background">
      <MobileAppHeader
        title={title}
        showBackButton={showBackButton}
        onBackClick={handleBackClick}
        onNotificationClick={onNotificationClick}
      />
      
      <main className="pb-16 min-h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
        {children}
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default MobileLayout;
