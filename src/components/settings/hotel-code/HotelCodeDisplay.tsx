
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HotelCodeDisplayProps {
  hotelCode: string;
  isLoading: boolean;
}

const HotelCodeDisplay = ({ hotelCode, isLoading }: HotelCodeDisplayProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (!hotelCode) return;
    
    navigator.clipboard.writeText(hotelCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: "Code Copied",
      description: "Hotel code copied to clipboard",
    });
  };

  if (isLoading && !hotelCode) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Input
        value={hotelCode}
        readOnly
        className="font-mono text-base"
        placeholder="No hotel code generated"
      />
      <Button 
        variant="outline" 
        size="icon" 
        onClick={copyToClipboard}
        disabled={!hotelCode}
      >
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default HotelCodeDisplay;
