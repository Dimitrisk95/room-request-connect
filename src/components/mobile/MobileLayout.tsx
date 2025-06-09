
import React, { ReactNode, useState } from 'react';
import MobileAppHeader from './MobileAppHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileQRScanButton from './MobileQRScanButton';
import QRCodeScanner from './QRCodeScanner';
import { useNavigate } from 'react-router-dom';
import { useQRCodeScanner } from '@/hooks/useQRCodeScanner';

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onNotificationClick?: () => void;
  showQRScan?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onNotificationClick,
  showQRScan = true
}) => {
  const navigate = useNavigate();
  const { isScanning, startScanning, stopScanning, handleScanResult } = useQRCodeScanner();

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
      
      {showQRScan && (
        <MobileQRScanButton onScanPress={startScanning} />
      )}
      
      <QRCodeScanner
        isOpen={isScanning}
        onScanResult={handleScanResult}
        onClose={stopScanning}
      />
    </div>
  );
};

export default MobileLayout;
