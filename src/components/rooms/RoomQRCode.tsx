
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode } from "lucide-react";

interface RoomQRCodeProps {
  hotelCode: string;
  roomCode: string;
  roomNumber: string;
}

const RoomQRCode: React.FC<RoomQRCodeProps> = ({ hotelCode, roomCode, roomNumber }) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate QR code
  useEffect(() => {
    if (hotelCode && roomCode) {
      // Create URL for direct room access
      const connectUrl = `${window.location.origin}/connect?hotel=${hotelCode}&room=${roomCode}`;
      
      // Generate QR code URL using Google Charts API
      const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(connectUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [hotelCode, roomCode]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "Room code has been copied to clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Room {roomNumber} Access Code</h3>
          <p className="text-muted-foreground mb-2">Scan this code or use the code below</p>
          
          <div className="flex items-center justify-center my-4">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt={`QR code for Room ${roomNumber}`}
                className="border rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center w-[200px] h-[200px] border rounded-lg">
                <QrCode className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <code className="bg-muted px-3 py-1 rounded-md text-lg font-mono">
              {roomCode}
            </code>
            <Button size="sm" variant="outline" onClick={copyRoomCode}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomQRCode;
