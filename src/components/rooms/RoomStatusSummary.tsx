
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, Bed, Wrench, Sparkles } from "lucide-react";
import { getRoomStatusSummary } from "@/context/rooms/roomStatusHandlers";
import { useAuth } from "@/context";

interface RoomStatusSummaryProps {
  onRefresh?: () => void;
}

export const RoomStatusSummary = ({ onRefresh }: RoomStatusSummaryProps) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    total: 0,
    vacant: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadSummary = async () => {
    if (!user?.hotelId) return;

    try {
      setIsLoading(true);
      const data = await getRoomStatusSummary(user.hotelId);
      setSummary(data);
    } catch (error) {
      console.error('Error loading room summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [user?.hotelId, onRefresh]);

  const getOccupancyRate = () => {
    if (summary.total === 0) return 0;
    return Math.round((summary.occupied / summary.total) * 100);
  };

  const statusCards = [
    {
      title: "Vacant",
      count: summary.vacant,
      icon: Hotel,
      color: "bg-green-100 text-green-800",
      description: "Available rooms"
    },
    {
      title: "Occupied",
      count: summary.occupied,
      icon: Bed,
      color: "bg-blue-100 text-blue-800",
      description: "Guests checked in"
    },
    {
      title: "Maintenance",
      count: summary.maintenance,
      icon: Wrench,
      color: "bg-orange-100 text-orange-800",
      description: "Needs repair"
    },
    {
      title: "Cleaning",
      count: summary.cleaning,
      icon: Sparkles,
      color: "bg-purple-100 text-purple-800",
      description: "Being serviced"
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Room Status Summary
          <Badge variant="outline">
            {getOccupancyRate()}% Occupancy
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusCards.map((status) => {
            const Icon = status.icon;
            return (
              <div key={status.title} className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-full ${status.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{status.count}</div>
                    <div className="text-sm font-medium">{status.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {status.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Rooms:</span>
            <span className="font-medium">{summary.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
