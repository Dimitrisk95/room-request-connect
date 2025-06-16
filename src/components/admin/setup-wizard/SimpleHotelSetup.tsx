
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hotel, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSimpleHotelSetup } from "./hooks/useSimpleHotelSetup";

const SimpleHotelSetup = () => {
  const { isCreating, createHotel } = useSimpleHotelSetup();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const setupData = {
      hotel: {
        name: formData.name,
        address: formData.address,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        hotelCode: '', // Will be auto-generated
      },
      rooms: {
        addRooms: false,
        createdRooms: 0,
        roomsToAdd: [],
      },
      staff: {
        addStaff: false,
        createdStaff: 0,
        staffToAdd: [],
      },
    };

    await createHotel(setupData);
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
            <p className="text-white/70">
              Enter your hotel information to get started with Roomlix
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Hotel Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Grand Hotel Paradise"
                  required
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
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
                    value={formData.contactEmail}
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
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={isCreating || !formData.name.trim()}
              >
                {isCreating ? (
                  "Creating Hotel..."
                ) : (
                  <>
                    Create Hotel & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-white/60">
                * Hotel code will be automatically generated for you
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleHotelSetup;
