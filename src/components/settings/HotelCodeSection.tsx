
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Copy, Check, RefreshCw, Loader } from 'lucide-react';
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
  const [isInitialFetch, setIsInitialFetch] = useState(!initialCode);

  // Fetch hotel code if not provided
  useEffect(() => {
    if (!initialCode) {
      fetchHotelCode();
    }
  }, [initialCode, hotelId]);

  const fetchHotelCode = async () => {
    if (!hotelId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('hotel_code')
        .eq('id', hotelId)
        .single();

      if (error) {
        console.error('Error fetching hotel code:', error);
        throw error;
      }
      
      if (data && data.hotel_code) {
        setHotelCode(data.hotel_code);
      } else if (isInitialFetch) {
        // Generate a new code if one doesn't exist during initial fetch
        await regenerateCode();
        setIsInitialFetch(false);
      }
    } catch (error) {
      console.error('Error fetching hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotel code. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateCode = async () => {
    if (!hotelId) return;
    
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
    if (!hotelCode) return;
    
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
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <>
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
            <Button 
              variant="outline" 
              onClick={regenerateCode} 
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {hotelCode ? 'Regenerate Code' : 'Generate Code'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelCodeSection;
