
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useMobileFeatures } from '@/hooks/use-mobile-features';

interface MobileQRScanButtonProps {
  onScanPress: () => void;
}

const MobileQRScanButton: React.FC<MobileQRScanButtonProps> = ({ onScanPress }) => {
  const { hapticFeedback } = useMobileFeatures();

  const handlePress = async () => {
    await hapticFeedback();
    onScanPress();
  };

  return (
    <Button
      onClick={handlePress}
      size="icon"
      className="fixed bottom-20 right-4 md:hidden h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
      aria-label="Scan QR Code"
    >
      <QrCode className="h-6 w-6" />
    </Button>
  );
};

export default MobileQRScanButton;
