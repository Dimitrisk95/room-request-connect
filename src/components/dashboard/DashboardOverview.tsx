
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, Users, Bed, Calendar, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalGuests: 0,
    pendingRequests: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0
  });
  const [hotelName, setHotelName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.hotelId) return;

      try {
        // Fetch hotel information
        const { data: hotel } = await supabase
          .from('hotels')
          .select('name')
          .eq('id', user.hotelId)
          .single();

        if (hotel) {
          setHotelName(hotel.name);
        }

        // Fetch rooms data
        const { data: rooms } = await supabase
          .from('rooms')
          .select('status')
          .eq('hotel_id', user.hotelId);

        if (rooms) {
          const totalRooms = rooms.length;
          const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
          
          setStats(prev => ({
            ...prev,
            totalRooms,
            occupiedRooms
          }));
        }

        // Fetch requests data
        const { data: requests } = await supabase
          .from('requests')
          .select('status')
          .eq('hotel_id', user.hotelId)
          .eq('status', 'pending');

        if (requests) {
          setStats(prev => ({
            ...prev,
            pendingRequests: requests.length
          }));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.hotelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center">
          <Hotel className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to {hotelName || "Your Hotel"}
            </h1>
            <p className="text-gray-600">
              Here's an overview of your hotel's current status
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedRooms} occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRooms > 0 
                ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedRooms} of {stats.totalRooms} rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todayCheckIns + stats.todayCheckOuts}
            </div>
            <p className="text-xs text-muted-foreground">
              Check-ins and check-outs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                Add New Room
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                View Requests
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                Manage Staff
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                Update Settings
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your hotel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• No recent activity to display</p>
              <p>• Start managing your hotel to see updates here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
