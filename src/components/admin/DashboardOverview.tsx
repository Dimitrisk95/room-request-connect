
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { Bed, Users, MessageSquare, Calendar, TrendingUp, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  pendingRequests: number;
  completedRequests: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    pendingRequests: 0,
    completedRequests: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    if (!user?.hotelId) return;

    try {
      setIsLoading(true);

      // Fetch room statistics
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("status")
        .eq("hotel_id", user.hotelId);

      if (roomsError) throw roomsError;

      // Fetch request statistics
      const { data: requestsData, error: requestsError } = await supabase
        .from("requests")
        .select("status")
        .eq("hotel_id", user.hotelId);

      if (requestsError) throw requestsError;

      // Calculate room stats
      const totalRooms = roomsData?.length || 0;
      const occupiedRooms = roomsData?.filter(room => room.status === 'occupied').length || 0;
      const availableRooms = roomsData?.filter(room => room.status === 'vacant').length || 0;
      const maintenanceRooms = roomsData?.filter(room => room.status === 'maintenance').length || 0;

      // Calculate request stats
      const pendingRequests = requestsData?.filter(req => req.status === 'pending').length || 0;
      const completedRequests = requestsData?.filter(req => req.status === 'completed').length || 0;

      setStats({
        totalRooms,
        occupiedRooms,
        availableRooms,
        maintenanceRooms,
        pendingRequests,
        completedRequests,
        todayCheckIns: 0, // TODO: Implement with reservations
        todayCheckOuts: 0, // TODO: Implement with reservations
      });

    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user?.hotelId]);

  const occupancyRate = stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              Rooms in your hotel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedRooms} of {stats.totalRooms} rooms occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Requests awaiting attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableRooms}</div>
            <p className="text-xs text-muted-foreground">
              Ready for new guests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Room Status Overview
            </CardTitle>
            <CardDescription>Current status of all rooms in your hotel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">Occupied</Badge>
              </div>
              <span className="font-semibold">{stats.occupiedRooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-800">Available</Badge>
              </div>
              <span className="font-semibold">{stats.availableRooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="bg-orange-100 text-orange-800">Maintenance</Badge>
              </div>
              <span className="font-semibold">{stats.maintenanceRooms}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Guest Requests
            </CardTitle>
            <CardDescription>Recent guest requests and service tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Pending</span>
              </div>
              <Badge variant="secondary">{stats.pendingRequests}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Completed</span>
              </div>
              <Badge variant="outline">{stats.completedRequests}</Badge>
            </div>
            {stats.pendingRequests > 0 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    You have {stats.pendingRequests} pending request{stats.pendingRequests !== 1 ? 's' : ''} that need attention
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Activity
          </CardTitle>
          <CardDescription>Check-ins, check-outs, and scheduled events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{stats.todayCheckIns}</div>
              <div className="text-sm text-blue-600">Check-ins Today</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{stats.todayCheckOuts}</div>
              <div className="text-sm text-purple-600">Check-outs Today</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">{occupancyRate}%</div>
              <div className="text-sm text-gray-600">Current Occupancy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
