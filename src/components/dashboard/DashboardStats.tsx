
import { Hotel, User, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  occupiedRooms: number;
  totalRooms: number;
  pendingRequests: number;
  urgentRequests: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

export const DashboardStats = ({
  occupiedRooms,
  totalRooms,
  pendingRequests,
  urgentRequests,
  todayCheckIns,
  todayCheckOuts,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
          <Hotel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupiedRooms}/{totalRooms}</div>
          <p className="text-xs text-muted-foreground">
            {totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}% occupancy rate
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRequests}</div>
          <p className="text-xs text-muted-foreground">{urgentRequests} urgent requests</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCheckIns}</div>
          <p className="text-xs text-muted-foreground">Expected today</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Check-outs</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCheckOuts}</div>
          <p className="text-xs text-muted-foreground">Departing today</p>
        </CardContent>
      </Card>
    </div>
  );
};
