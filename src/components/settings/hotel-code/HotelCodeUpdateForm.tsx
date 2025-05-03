
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader } from 'lucide-react';
import { useHotelCodeUpdate } from './useHotelCodeUpdate';

interface HotelCodeUpdateFormProps {
  hotelId: string;
  onCodeUpdated: (newCode: string) => void;
}

const HotelCodeUpdateForm = ({ hotelId, onCodeUpdated }: HotelCodeUpdateFormProps) => {
  const {
    newCode,
    setNewCode,
    error,
    isLoading,
    isChecking,
    updateHotelCode
  } = useHotelCodeUpdate(hotelId, onCodeUpdated);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Update Hotel Code</h3>
      <div className="flex space-x-2">
        <Input
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="Enter new hotel code"
          className="font-mono"
        />
        <Button 
          variant="outline" 
          onClick={() => updateHotelCode()}
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
  );
};

export default HotelCodeUpdateForm;
