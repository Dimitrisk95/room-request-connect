
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Bed, MessageSquare, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalRooms: number;
  occupiedRooms: number;
  totalRequests: number;
  resolvedRequests: number;
  staffMembers: number;
  avgResolutionTime: number;
  monthlyOccupancy: Array<{ month: string; occupancy: number }>;
  requestsByCategory: Array<{ category: string; count: number; color: string }>;
  requestsByPriority: Array<{ priority: string; count: number }>;
  roomStatusDistribution: Array<{ status: string; count: number; color: string }>;
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRooms: 0,
    occupiedRooms: 0,
    totalRequests: 0,
    resolvedRequests: 0,
    staffMembers: 0,
    avgResolutionTime: 0,
    monthlyOccupancy: [],
    requestsByCategory: [],
    requestsByPriority: [],
    roomStatusDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchAnalyticsData();
  }, [user?.hotelId, timeRange]);

  const fetchAnalyticsData = async () => {
    if (!user?.hotelId) return;

    try {
      // Fetch rooms data
      const { data: rooms } = await supabase
        .from('rooms')
        .select('status')
        .eq('hotel_id', user.hotelId);

      // Fetch requests data
      const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .eq('hotel_id', user.hotelId);

      // Fetch staff data
      const { data: staff } = await supabase
        .from('users')
        .select('*')
        .eq('hotel_id', user.hotelId)
        .eq('role', 'staff');

      const totalRooms = rooms?.length || 0;
      const occupiedRooms = rooms?.filter(room => room.status === 'occupied').length || 0;
      const totalRequests = requests?.length || 0;
      const resolvedRequests = requests?.filter(req => req.status === 'resolved').length || 0;
      const staffMembers = staff?.length || 0;

      // Calculate average resolution time (mock data for now)
      const avgResolutionTime = 2.5; // hours

      // Generate monthly occupancy data (mock data)
      const monthlyOccupancy = [
        { month: 'Jan', occupancy: 75 },
        { month: 'Feb', occupancy: 82 },
        { month: 'Mar', occupancy: 78 },
        { month: 'Apr', occupancy: 85 },
        { month: 'May', occupancy: 90 },
        { month: 'Jun', occupancy: 88 }
      ];

      // Requests by category
      const categoryCount: { [key: string]: number } = {};
      requests?.forEach(req => {
        categoryCount[req.category] = (categoryCount[req.category] || 0) + 1;
      });

      const requestsByCategory = Object.entries(categoryCount).map(([category, count], index) => ({
        category,
        count,
        color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'][index % 5]
      }));

      // Requests by priority
      const priorityCount: { [key: string]: number } = {};
      requests?.forEach(req => {
        priorityCount[req.priority] = (priorityCount[req.priority] || 0) + 1;
      });

      const requestsByPriority = Object.entries(priorityCount).map(([priority, count]) => ({
        priority,
        count
      }));

      // Room status distribution
      const statusCount: { [key: string]: number } = {};
      rooms?.forEach(room => {
        statusCount[room.status] = (statusCount[room.status] || 0) + 1;
      });

      const roomStatusDistribution = Object.entries(statusCount).map(([status, count], index) => ({
        status,
        count,
        color: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]
      }));

      setAnalytics({
        totalRooms,
        occupiedRooms,
        totalRequests,
        resolvedRequests,
        staffMembers,
        avgResolutionTime,
        monthlyOccupancy,
        requestsByCategory,
        requestsByPriority,
        roomStatusDistribution
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const occupancyRate = analytics.totalRooms > 0 ? Math.round((analytics.occupiedRooms / analytics.totalRooms) * 100) : 0;
  const requestResolutionRate = analytics.totalRequests > 0 ? Math.round((analytics.resolvedRequests / analytics.totalRequests) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">View hotel performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Bed className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold">{occupancyRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">+5% from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Request Resolution</p>
                <p className="text-2xl font-bold">{requestResolutionRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">+3% from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Staff Members</p>
                <p className="text-2xl font-bold">{analytics.staffMembers}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">Active team size</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold">{analytics.avgResolutionTime}h</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-green-600">-0.5h from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Occupancy Trend</CardTitle>
            <CardDescription>Room occupancy percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyOccupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Room Status Distribution</CardTitle>
            <CardDescription>Current status of all rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.roomStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.roomStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Requests by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Category</CardTitle>
            <CardDescription>Distribution of guest request types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.requestsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Requests by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Priority</CardTitle>
            <CardDescription>Priority distribution of guest requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.requestsByPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key findings and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">High Occupancy Rate</h4>
                  <p className="text-sm text-gray-600">Your {occupancyRate}% occupancy rate is above industry average.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Efficient Request Handling</h4>
                  <p className="text-sm text-gray-600">Average resolution time of {analytics.avgResolutionTime} hours shows efficient staff performance.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Staff Optimization</h4>
                  <p className="text-sm text-gray-600">Consider adding more staff during peak hours to improve response times.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Guest Satisfaction</h4>
                  <p className="text-sm text-gray-600">Focus on maintenance requests as they represent the largest category.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
