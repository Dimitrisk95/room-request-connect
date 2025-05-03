
import { Room } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RoomDetailsInfo = ({ room }: { room: Room }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (room.room_code) {
      navigator.clipboard.writeText(room.room_code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Room Number</p>
          <p className="text-lg font-semibold">{room.roomNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Floor</p>
          <p className="text-lg font-semibold">{room.floor}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="text-lg font-semibold">{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Bed Type</p>
          <p className="text-lg font-semibold">
            {room.bedType 
              ? room.bedType.charAt(0).toUpperCase() + room.bedType.slice(1)
              : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge
            className={`capitalize mt-1 ${
              room.status === "vacant"
                ? "bg-green-100 text-green-800"
                : room.status === "occupied"
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {room.status}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Capacity</p>
          <p className="text-lg font-semibold">{room.capacity} person(s)</p>
        </div>
      </div>
      
      {/* Room Access Code Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-md font-semibold mb-2">Room Access Code</h3>
        {room.room_code ? (
          <div className="flex items-center space-x-2">
            <span className="font-mono text-base px-3 py-1 bg-muted rounded-md">
              {room.room_code}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyToClipboard}
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No access code available for this room.</p>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsInfo;
