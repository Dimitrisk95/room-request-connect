
import React from 'react';
import { useAuth } from '@/context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Key } from 'lucide-react';
import { useHotelCode } from '@/hooks/useHotelCode';

interface DashboardHeaderProps {
  hotelName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ hotelName }) => {
  const { user } = useAuth();
  const { hotelCode } = useHotelCode();
  
  const hasHotelCode = Boolean(hotelCode);
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {hotelName ? `${hotelName} Dashboard` : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'User'}
        </p>
      </div>

      {hasHotelCode && (isAdmin || isStaff) && (
        <Card className="mt-3 md:mt-0">
          <CardContent className="flex items-center p-3">
            <div className="flex items-center mr-2">
              <Key className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm text-muted-foreground">Hotel Code:</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {hotelCode}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHeader;
