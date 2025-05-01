
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateHotelCode } from '@/utils/codeGenerator';

interface HotelCodeSectionProps {
  hotelId: string;
  hotelName: string;
  initialCode?: string;
}

const HotelCodeSection: React.FC<HotelCodeSectionProps> = ({
  hotelId,
  hotelName,
  initialCode,
}) => {
  const { toast } = useToast();
  const [hotelCode, setHotelCode] = useState(initialCode || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch hotel code if not provided
  useEffect(() => {
    if (!initialCode) {
      fetchHotelCode();
    }
  }, [initialCode]);

  const fetchHotelCode = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('hotel_code')
        .eq('id', hotelId)
        .single();

      if (error) throw error;
      
      if (data && data.hotel_code) {
        setHotelCode(data.hotel_code);
      } else {
        // Generate a new code if one doesn't exist
        regenerateCode();
      }
    } catch (error) {
      console.error('Error fetching hotel code:', error);
    }
  };

  const regenerateCode = async () => {
    setIsLoading(true);
    try {
      // Generate a new hotel code
      const newCode = generateHotelCode(hotelName);
      
      // Update the code in the database
      const { error } = await supabase
        .from('hotels')
        .update({ hotel_code: newCode })
        .eq('id', hotelId);

      if (error) throw error;
      
      setHotelCode(newCode);
      
      toast({
        title: "Hotel Code Updated",
        description: "Your hotel code has been successfully regenerated.",
      });
    } catch (error) {
      console.error('Error regenerating hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate hotel code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hotelCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: "Code Copied",
      description: "Hotel code copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Hotel Connection Code
        </CardTitle>
        <CardDescription>
          Share this code with guests to connect to your hotel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={hotelCode}
            readOnly
            className="font-mono text-base"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={copyToClipboard}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={regenerateCode} 
          disabled={isLoading}
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default HotelCodeSection;
