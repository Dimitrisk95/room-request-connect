
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Users, Wifi, Coffee, Car, Wrench, Sparkles } from 'lucide-react';
import { Room } from '@/types';

interface MobileRoomCardProps {
  room: Room;
  onQuickAction: (roomNumber: string, action: string) => void;
  onViewDetails: (room: Room) => void;
}

const MobileRoomCard: React.FC<MobileRoomCardProps> = ({
  room,
  onQuickAction,
  onViewDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vacant': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cleaning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'out-of-order': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'maintenance': return <Wrench className="h-3 w-3" />;
      case 'cleaning': return <Sparkles className="h-3 w-3" />;
      default: return null;
    }
  };

  const quickActions = [
    { label: 'Check In', action: 'checkin', show: room.status === 'vacant' },
    { label: 'Check Out', action: 'checkout', show: room.status === 'occupied' },
    { label: 'Clean', action: 'cleaning', show: room.status === 'vacant' },
    { label: 'Maintenance', action: 'maintenance', show: true }
  ].filter(action => action.show);

  return (
    <Card className="mb-3 shadow-sm border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Room {room.number}</h3>
            <p className="text-sm text-muted-foreground">{room.type}</p>
          </div>
          <Badge 
            className={`${getStatusColor(room.status)} flex items-center gap-1`}
            variant="outline"
          >
            {getStatusIcon(room.status)}
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </Badge>
        </div>

        {room.currentGuest && (
          <div className="mb-3 p-2 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              Guest: {room.currentGuest}
            </p>
            {room.checkOutDate && (
              <p className="text-xs text-blue-700">
                Check-out: {new Date(room.checkOutDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            <span>{room.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{room.capacity} guests</span>
          </div>
          {room.amenities?.includes('wifi') && <Wifi className="h-3 w-3" />}
          {room.amenities?.includes('coffee') && <Coffee className="h-3 w-3" />}
          {room.amenities?.includes('parking') && <Car className="h-3 w-3" />}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(room)}
            className="flex-1"
          >
            Details
          </Button>
          {quickActions.slice(0, 2).map((action) => (
            <Button
              key={action.action}
              variant="secondary"
              size="sm"
              onClick={() => onQuickAction(room.number, action.action)}
              className="flex-1"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileRoomCard;
