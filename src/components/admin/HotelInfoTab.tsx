
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Loader, Check } from 'lucide-react';
import { generateHotelCode } from '@/utils/codeGenerator';

const HotelInfoTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hotelCode, setHotelCode] = useState<string>('');
  const [hotelName, setHotelName] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (user?.hotelId) {
      fetchHotelInfo();
    } else {
      setIsLoading(false);
    }
  }, [user?.hotelId]);

  const fetchHotelInfo = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('hotels')
        .select('hotel_code, name')
        .eq('id', user?.hotelId)
        .single();

      if (error) throw error;
      
      setHotelName(data.name || '');
      setHotelCode(data.hotel_code || '');
      
      // If no hotel code exists, generate one
      if (!data.hotel_code) {
        await regenerateCode(data.name);
      }
    } catch (error) {
      console.error('Error fetching hotel info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotel information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateCode = async (name: string = hotelName) => {
    if (!user?.hotelId || !name) return;
    
    try {
      setRegenerating(true);
      const newCode = generateHotelCode(name);
      
      const { error } = await supabase
        .from('hotels')
        .update({ hotel_code: newCode })
        .eq('id', user.hotelId);

      if (error) throw error;
      
      setHotelCode(newCode);
      toast({
        title: "Success",
        description: "Hotel code has been regenerated",
      });
    } catch (error) {
      console.error('Error regenerating code:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate hotel code",
        variant: "destructive"
      });
    } finally {
      setRegenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hotelCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Hotel code copied to clipboard",
    });
  };

  if (!user?.hotelId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Hotel Found</CardTitle>
          <CardDescription>
            Please create a hotel first to manage hotel information.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotel Information</CardTitle>
        <CardDescription>
          Manage your hotel's access codes and information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Loading hotel information...</span>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Hotel Code</h3>
              <p className="text-sm text-muted-foreground">
                Guests use this code to connect to your hotel in the app.
              </p>
              <div className="flex space-x-2 mt-2">
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
                className="mt-2"
                onClick={() => regenerateCode()} 
                disabled={regenerating}
              >
                {regenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Code
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelInfoTab;
