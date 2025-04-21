
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HotelSelectorProps {
  onHotelSelect: (hotelId: string) => void;
}

const HotelSelector: React.FC<HotelSelectorProps> = ({ onHotelSelect }) => {
  const [hotelCode, setHotelCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onHotelSelect(hotelCode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Hotel</CardTitle>
        <CardDescription>
          Enter the hotel code provided by your hotel
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelCode">Hotel Code</Label>
            <Input
              id="hotelCode"
              type="text"
              placeholder="Enter hotel code (e.g. HOTEL123)"
              value={hotelCode}
              onChange={(e) => setHotelCode(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Connect to Hotel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HotelSelector;
