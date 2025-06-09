
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, Bed, Wrench, Sparkles, ArrowRight } from "lucide-react";
import { Room } from "@/types";
import { RoomStatus, getRoomsByStatus, bulkUpdateRoomStatus } from "@/context/rooms/roomStatusHandlers";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onRefresh: () => void;
}

export const QuickActions = ({ onRefresh }: QuickActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const quickActions = [
    {
      id: "checkout-cleaning",
      title: "Mark Checked-out Rooms for Cleaning",
      description: "Move all occupied rooms to cleaning status",
      fromStatus: "occupied" as RoomStatus,
      toStatus: "cleaning" as RoomStatus,
      icon: Sparkles,
      color: "bg-blue-500"
    },
    {
      id: "cleaning-vacant",
      title: "Mark Cleaned Rooms as Vacant",
      description: "Move all cleaning rooms to vacant status",
      fromStatus: "cleaning" as RoomStatus,
      toStatus: "vacant" as RoomStatus,
      icon: Hotel,
      color: "bg-green-500"
    },
    {
      id: "maintenance-vacant",
      title: "Complete Maintenance",
      description: "Move all maintenance rooms to vacant status",
      fromStatus: "maintenance" as RoomStatus,
      toStatus: "vacant" as RoomStatus,
      icon: Wrench,
      color: "bg-orange-500"
    }
  ];

  const handleQuickAction = async (action: typeof quickActions[0]) => {
    if (!user?.hotelId) return;

    setIsProcessing(action.id);
    try {
      // Get rooms with the from status
      const rooms = await getRoomsByStatus(user.hotelId, action.fromStatus);
      
      if (rooms.length === 0) {
        toast({
          title: "No rooms to process",
          description: `No rooms found with ${action.fromStatus} status`,
        });
        return;
      }

      // Update all rooms to the new status
      const roomIds = rooms.map(room => room.id);
      await bulkUpdateRoomStatus(roomIds, action.toStatus, user.id);

      toast({
        title: "Success",
        description: `${rooms.length} rooms updated from ${action.fromStatus} to ${action.toStatus}`,
      });

      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process rooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isActive = isProcessing === action.id;
            
            return (
              <div 
                key={action.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {action.fromStatus}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {action.toStatus}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    disabled={isActive}
                  >
                    {isActive ? "Processing..." : "Apply"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
