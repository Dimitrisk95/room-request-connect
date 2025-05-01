
import React from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface RoomQRCodeProps {
  hotelCode: string;
  roomCode: string;
  roomNumber: string;
  onPrint?: () => void;
}

const RoomQRCode: React.FC<RoomQRCodeProps> = ({
  hotelCode,
  roomCode,
  roomNumber,
  onPrint
}) => {
  // Generate URL for QR code
  const connectionUrl = `${window.location.origin}/connect?hotel=${hotelCode}&room=${roomCode}`;
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Room ${roomNumber} Connection</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .code-card { border: 1px solid #ccc; padding: 20px; margin: 20px auto; max-width: 400px; }
                .room-number { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .codes { margin: 15px 0; font-size: 16px; }
                .code { font-weight: bold; font-family: monospace; font-size: 18px; letter-spacing: 2px; }
                .qr-placeholder { width: 200px; height: 200px; margin: 20px auto; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; }
                .instructions { margin-top: 20px; text-align: left; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="code-card">
                <div class="room-number">Room ${roomNumber}</div>
                <div class="codes">
                  <p>Hotel Code: <span class="code">${hotelCode}</span></p>
                  <p>Room Code: <span class="code">${roomCode}</span></p>
                </div>
                <div class="qr-placeholder">
                  <p>QR code for ${connectionUrl}</p>
                </div>
                <div class="instructions">
                  <p>1. Scan this QR code or visit ${window.location.origin}/connect</p>
                  <p>2. Enter the hotel code: <strong>${hotelCode}</strong></p>
                  <p>3. Enter your room code: <strong>${roomCode}</strong></p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          Room Connection Codes
        </CardTitle>
        <CardDescription>
          Give these codes to guests to connect to room {roomNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Hotel Code:</p>
            <p className="bg-muted p-2 rounded font-mono text-center">{hotelCode}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Room Code:</p>
            <p className="bg-muted p-2 rounded font-mono text-center">{roomCode}</p>
          </div>
        </div>
        
        <div className="flex justify-center py-4">
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <QrCode className="h-24 w-24 mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                QR code for direct connection
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePrint} className="w-full">
          Print Codes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomQRCode;
