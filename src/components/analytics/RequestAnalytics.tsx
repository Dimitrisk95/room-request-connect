
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Request } from "@/context/requests/requestHandlers";

interface RequestAnalyticsProps {
  requests: Request[];
}

export const RequestAnalytics = ({ requests }: RequestAnalyticsProps) => {
  const categoryStats = requests.reduce((acc, req) => {
    const category = req.category;
    if (!acc[category]) {
      acc[category] = { total: 0, resolved: 0, pending: 0, inProgress: 0 };
    }
    acc[category].total++;
    if (req.status === 'resolved') acc[category].resolved++;
    if (req.status === 'pending') acc[category].pending++;
    if (req.status === 'in-progress') acc[category].inProgress++;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.entries(categoryStats).map(([category, stats]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    total: stats.total,
    resolved: stats.resolved,
    pending: stats.pending,
    inProgress: stats.inProgress,
    resolutionRate: Math.round((stats.resolved / stats.total) * 100)
  }));

  const chartConfig = {
    total: { label: "Total Requests" },
    resolved: { label: "Resolved" },
    pending: { label: "Pending" },
    inProgress: { label: "In Progress" }
  };

  const totalRequests = requests.length;
  const resolvedRequests = requests.filter(r => r.status === 'resolved').length;
  const avgResolutionRate = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgResolutionRate}%</div>
            <p className="text-xs text-muted-foreground">{resolvedRequests} resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.5min</div>
            <p className="text-xs text-muted-foreground">Est. average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chartData.length > 0 ? chartData.reduce((a, b) => a.total > b.total ? a : b).category : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Request type</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                <Bar dataKey="pending" fill="#eab308" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.category}</span>
                    <Badge variant="outline">{item.total} total</Badge>
                  </div>
                  <Badge 
                    variant={item.resolutionRate >= 80 ? "default" : 
                            item.resolutionRate >= 60 ? "secondary" : "destructive"}
                  >
                    {item.resolutionRate}% resolved
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['urgent', 'high', 'medium', 'low'].map((priority) => {
                const count = requests.filter(r => r.priority === priority).length;
                const percentage = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        priority === 'urgent' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-orange-500' :
                        priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="capitalize font-medium">{priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
