
import { useState } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { mockRequests } from "@/context/requests/requestHandlers";
import { useAuth } from "@/context";
import { Search } from "lucide-react";
import TasksList from "@/components/staff/TasksList";
import StaffTeam from "@/components/staff/StaffTeam";

const StaffView = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter requests that are assigned to the current staff member
  const myRequests = mockRequests.filter(
    req => req.assignedTo === user?.id && req.status !== "resolved" && req.status !== "cancelled"
  );
  
  // Filter pending requests that are not assigned to anyone
  const pendingRequests = mockRequests.filter(
    req => !req.assignedTo && req.status === "pending"
  );
  
  // Filter resolved requests that were handled by the current staff member
  const completedRequests = mockRequests.filter(
    req => req.resolvedBy === user?.id && req.status === "resolved"
  );
  
  // All requests for search
  const allRequests = [...myRequests, ...pendingRequests, ...mockRequests.filter(
    req => !myRequests.includes(req) && !pendingRequests.includes(req)
  )];
  
  // Search functionality
  const filteredRequests = searchTerm 
    ? allRequests.filter(req => 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.guestName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allRequests;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="my-tasks">
          <TabsList className="mb-6">
            <TabsTrigger value="my-tasks">My Tasks ({myRequests.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-tasks">
            <Card>
              <CardHeader>
                <CardTitle>My Assigned Tasks</CardTitle>
                <CardDescription>
                  Requests assigned to you that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList 
                  requests={myRequests}
                  title="My Tasks"
                  description="Requests assigned to you that need attention"
                  emptyMessage="You have no assigned tasks"
                  emptyDescription="Check the available tab for new requests"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="available">
            <Card>
              <CardHeader>
                <CardTitle>Available Requests</CardTitle>
                <CardDescription>
                  Pending requests that need to be assigned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList 
                  requests={pendingRequests}
                  title="Available"
                  description="Pending requests that need to be assigned"
                  emptyMessage="No pending requests"
                  emptyDescription="All guest requests are being handled"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Requests</CardTitle>
                <CardDescription>
                  Requests you've successfully resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList 
                  requests={completedRequests}
                  title="Completed"
                  description="Requests you've successfully resolved"
                  emptyMessage="You haven't completed any requests yet"
                  emptyDescription=""
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Staff Team section */}
        <StaffTeam />
      </div>
    </DashboardShell>
  );
};

export default StaffView;
