
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Copy, Check, Loader, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useHotelCode } from '@/hooks/useHotelCode';

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
  const { hotelCode, setHotelCode, refetch } = useHotelCode();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setHotelCode(initialCode);
    }
  }, [initialCode]);

  const checkCodeAvailability = async (code: string) => {
    setIsChecking(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id')
        .eq('hotel_code', code)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      if (data && data.id !== hotelId) {
        setError("This hotel code is already taken. Please try another one.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking code availability:', error);
      setError("Error checking code availability. Please try again.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const updateHotelCode = async () => {
    if (!hotelId || !newCode) return;
    
    // Validate the format of the code
    if (!/^[a-zA-Z0-9]+$/.test(newCode)) {
      setError("Hotel code can only contain letters and numbers (no spaces or special characters)");
      return;
    }
    
    if (newCode.length < 3 || newCode.length > 20) {
      setError("Hotel code must be between 3 and 20 characters");
      return;
    }
    
    // Check if code is available
    const isAvailable = await checkCodeAvailability(newCode);
    if (!isAvailable) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ hotel_code: newCode })
        .eq('id', hotelId);

      if (error) throw error;
      
      // Update local state and cache
      setHotelCode(newCode);
      setNewCode('');
      localStorage.setItem(`hotelCode_${hotelId}`, newCode);
      
      toast({
        title: "Hotel Code Updated",
        description: "Your hotel code has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to update hotel code. Please try again.",
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
        {isLoading && !hotelCode ? (
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
            
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-medium">Update Hotel Code</h3>
              <div className="flex space-x-2">
                <Input
                  value={newCode}
                  onChange={(e) => {
                    setNewCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter new hotel code"
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  onClick={updateHotelCode} 
                  disabled={isLoading || isChecking || !newCode}
                >
                  {isLoading || isChecking ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Use only letters and numbers without spaces (e.g., ParadiseHotel, GrandResort123).
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelCodeSection;
