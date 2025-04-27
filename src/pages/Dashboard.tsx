import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Hotel, User, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context";
import { fetchRequests, Request } from "@/context/requests/requestHandlers";

const Dashboard = () => {
  const { user } = useAuth();
  const [occupiedRooms, setOccupiedRooms] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<number>(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState<number>(0);
  const [urgentRequests, setUrgentRequests] = useState<number>(0);

  useEffect(() => {
    if (user?.hotelId) {
      fetchDashboardData();
    }
  }, [user?.hotelId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch rooms data
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('status')
        .eq('hotel_id', user?.hotelId);

      if (roomsData) {
        setTotalRooms(roomsData.length);
        setOccupiedRooms(roomsData.filter(room => room.status === 'occupied').length);
      }

      // Fetch requests data
      const requests = await fetchRequests(user?.hotelId || '');
      
      // Filter pending requests
      const pendingReqs = requests.filter(req => req.status === 'pending');
      setPendingRequests(pendingReqs);
      
      // Count urgent requests
      setUrgentRequests(requests.filter(req => 
        req.priority === 'urgent' && ['pending', 'in-progress'].includes(req.status)
      ).length);

      // Add more data fetching as needed for check-ins and check-outs
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link to="/rooms">Manage Rooms</Link>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupied Rooms
              </CardTitle>
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
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {urgentRequests} urgent requests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Check-ins
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayCheckIns}</div>
              <p className="text-xs text-muted-foreground">
                Expected today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Check-outs
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayCheckOuts}</div>
              <p className="text-xs text-muted-foreground">
                Departing today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent activity section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent requests */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className={`h-2 w-2 rounded-full ${
                        request.priority === "urgent" ? "bg-destructive" :
                        request.priority === "high" ? "bg-warning" : 
                        "bg-muted"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {request.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Room {request.roomNumber} • {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/request/${request.id}`}>View</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No pending requests
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/requests">View All Requests</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's schedule */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayCheckIns > 0 || todayCheckOuts > 0 ? (
                  <>
                    {Array.from({ length: Math.min(todayCheckIns, 3) }).map((_, index) => (
                      <div key={`checkin-${index}`} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="bg-primary h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Check-in: Guest Name
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Room Number • 2 guests
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/rooms`}>Prepare</Link>
                        </Button>
                      </div>
                    ))}
                    {Array.from({ length: Math.min(todayCheckOuts, 2) }).map((_, index) => (
                      <div key={`checkout-${index}`} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="bg-muted h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Check-out: Guest Name
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Room Number • Departure
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/calendar`}>Process</Link>
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No check-ins or check-outs today
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/calendar">View Calendar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Dashboard;
