
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { useHotelCode } from '@/hooks/useHotelCode';
import HotelCodeDisplay from './HotelCodeDisplay';
import HotelCodeUpdateForm from './HotelCodeUpdateForm';

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
  const { hotelCode, setHotelCode, isLoading, updateCache } = useHotelCode();

  useEffect(() => {
    if (initialCode) {
      setHotelCode(initialCode);
    }
  }, [initialCode, setHotelCode]);

  const handleCodeUpdated = (newCode: string) => {
    updateCache(newCode);
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
        <HotelCodeDisplay 
          hotelCode={hotelCode} 
          isLoading={isLoading} 
        />
        
        <div className="pt-4">
          <HotelCodeUpdateForm 
            hotelId={hotelId} 
            onCodeUpdated={handleCodeUpdated} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCodeSection;
