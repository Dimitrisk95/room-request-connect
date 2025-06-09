
import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMobileFeatures } from '@/hooks/use-mobile-features';
import { QrCode, X } from 'lucide-react';

interface QRCodeScannerProps {
  onScanResult: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanResult,
  onClose,
  isOpen
}) => {
  const { toast } = useToast();
  const { isNative, hapticFeedback } = useMobileFeatures();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen && isNative) {
      checkCameraPermissions();
    }
  }, [isOpen, isNative]);

  const checkCameraPermissions = async () => {
    try {
      const permissions = await Camera.checkPermissions();
      if (permissions.camera === 'granted') {
        setHasPermission(true);
      } else if (permissions.camera === 'denied') {
        setHasPermission(false);
      } else {
        // Request permissions
        const result = await Camera.requestPermissions({ permissions: ['camera'] });
        setHasPermission(result.camera === 'granted');
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setHasPermission(false);
    }
  };

  const startScanning = async () => {
    if (!isNative) {
      toast({
        title: "Camera Not Available",
        description: "QR code scanning is only available on mobile devices.",
        variant: "destructive"
      });
      return;
    }

    if (hasPermission === false) {
      toast({
        title: "Camera Permission Required",
        description: "Please grant camera permissions to scan QR codes.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsScanning(true);
      await hapticFeedback();

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: 'Scan QR Code',
        promptLabelPhoto: 'Take Photo',
        promptLabelPicture: 'Choose from Photos'
      });

      if (image.dataUrl) {
        // In a real implementation, you would decode the QR code from the image
        // For now, we'll simulate a successful scan
        const mockQRData = "ROOM_CODE_123"; // This would be decoded from the actual image
        
        await hapticFeedback();
        onScanResult(mockQRData);
        
        toast({
          title: "QR Code Scanned",
          description: "Room access code detected successfully.",
        });
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to scan QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualEntry = () => {
    // For demo purposes, simulate manual code entry
    const manualCode = prompt("Enter room code manually:");
    if (manualCode) {
      onScanResult(manualCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Scan QR Code</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <QrCode className="h-12 w-12 text-primary" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Position the QR code within the camera frame to scan
            </p>

            {hasPermission === false && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  Camera permission is required to scan QR codes.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={startScanning} 
                disabled={isScanning || hasPermission === false}
                className="w-full"
              >
                {isScanning ? "Scanning..." : "Start Camera"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleManualEntry}
                className="w-full"
              >
                Enter Code Manually
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeScanner;
