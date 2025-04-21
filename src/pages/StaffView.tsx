
import { useState } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockRequests } from "@/data/mockData";
import { useAuth } from "@/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CheckCircle, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

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

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-pending text-pending-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "in-progress":
        return "bg-pending text-pending-foreground";
      case "resolved":
        return "bg-success text-success-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
                {myRequests.length > 0 ? (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Room {request.roomNumber} • {request.guestName}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-2 text-sm line-clamp-2">{request.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(request.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <Button asChild>
                            <Link to={`/request/${request.id}`}>Handle Request</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CheckCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p>You have no assigned tasks</p>
                    <p className="text-sm">Check the available tab for new requests</p>
                  </div>
                )}
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
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Room {request.roomNumber} • {request.guestName}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-2 text-sm line-clamp-2">{request.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Bell className="h-4 w-4" />
                            <span>
                              {new Date(request.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <Button asChild>
                            <Link to={`/request/${request.id}`}>Claim Request</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CheckCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p>No pending requests</p>
                    <p className="text-sm">All guest requests are being handled</p>
                  </div>
                )}
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
                {completedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {completedRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Room {request.roomNumber} • {request.guestName}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-success text-success-foreground">
                            Resolved
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm line-clamp-2">{request.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2 text-sm text-success">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Resolved on {new Date(request.resolvedAt || "").toLocaleString()}
                            </span>
                          </div>
                          <Button variant="outline" asChild>
                            <Link to={`/request/${request.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't completed any requests yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Staff Team section */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Team</CardTitle>
            <CardDescription>
              Your colleagues who are helping with guest requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Avatar>
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Staff Member</div>
                  <div className="text-sm text-muted-foreground">Maintenance</div>
                </div>
                <Badge variant="outline" className="ml-2 bg-success/10 text-success">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Jane Doe</div>
                  <div className="text-sm text-muted-foreground">Housekeeping</div>
                </div>
                <Badge variant="outline" className="ml-2 bg-success/10 text-success">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Avatar>
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Robert Smith</div>
                  <div className="text-sm text-muted-foreground">Room Service</div>
                </div>
                <Badge variant="outline" className="ml-2">
                  Offline
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default StaffView;
