
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hotel, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    hotelCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHotelData({
      ...hotelData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create hotel
      const { data: hotelResult, error: hotelError } = await supabase
        .from('hotels')
        .insert({
          name: hotelData.name,
          address: hotelData.address,
          contact_email: hotelData.contactEmail,
          contact_phone: hotelData.contactPhone,
          hotel_code: hotelData.hotelCode
        })
        .select()
        .single();

      if (hotelError) throw hotelError;

      // Update user with hotel_id
      const { error: userError } = await supabase
        .from('users')
        .update({ hotel_id: hotelResult.id })
        .eq('id', user?.id);

      if (userError) throw userError;

      toast({
        title: "Hotel Created Successfully!",
        description: "Your hotel has been set up. Redirecting to dashboard...",
      });

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to create hotel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3">
                <Hotel className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Setup Your Hotel</CardTitle>
            <CardDescription className="text-white/70">
              Let's get your hotel configured in Roomlix
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Hotel Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={hotelData.name}
                    onChange={handleInputChange}
                    placeholder="Grand Hotel Paradise"
                    required
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hotelCode" className="text-white">Hotel Code *</Label>
                  <Input
                    id="hotelCode"
                    name="hotelCode"
                    value={hotelData.hotelCode}
                    onChange={handleInputChange}
                    placeholder="GHP001"
                    required
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={hotelData.address}
                  onChange={handleInputChange}
                  placeholder="123 Paradise Street, City, Country"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={hotelData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="info@grandhotel.com"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-white">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={hotelData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Creating Hotel..."
                ) : (
                  <>
                    Create Hotel & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
