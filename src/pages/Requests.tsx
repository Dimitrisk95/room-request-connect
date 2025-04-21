
import { useState } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockRequests } from "@/data/mockData";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Filter, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Request, RequestStatus } from "@/types";

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all");
  
  // Filter requests by search term and status
  const filteredRequests = mockRequests.filter(
    (req) => {
      const matchesSearch = searchTerm === "" || 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.roomNumber.includes(searchTerm) ||
        req.guestName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || req.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }
  );
  
  // Get pending, in-progress, and resolved request counts
  const pendingCount = mockRequests.filter(req => req.status === "pending").length;
  const inProgressCount = mockRequests.filter(req => req.status === "in-progress").length;
  const resolvedCount = mockRequests.filter(req => req.status === "resolved").length;
  
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
          <h1 className="text-2xl font-bold tracking-tight">All Requests</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full max-w-[240px]">
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

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-pending/10">
                  <Filter className="h-6 w-6 text-pending" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">{resolvedCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setFilterStatus(value as RequestStatus | "all")}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Requests</CardTitle>
                <CardDescription>
                  Showing {filteredRequests.length} requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="flex items-center border rounded-lg p-4">
                        <div className={`h-10 w-1 rounded-full ${
                          request.status === "pending" ? "bg-warning" :
                          request.status === "in-progress" ? "bg-pending" :
                          request.status === "resolved" ? "bg-success" :
                          "bg-destructive"
                        } mr-4`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="font-medium truncate">{request.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Room {request.roomNumber} • {request.guestName}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Badge variant="outline" className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                            <Button asChild size="sm">
                              <Link to={`/request/${request.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No requests found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  Requests waiting to be addressed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="flex items-center border rounded-lg p-4">
                        <div className="h-10 w-1 rounded-full bg-warning mr-4" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="font-medium truncate">{request.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Room {request.roomNumber} • {request.guestName}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Badge variant="outline" className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                            <Button asChild size="sm">
                              <Link to={`/request/${request.id}`}>Handle Request</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No pending requests found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>In Progress Requests</CardTitle>
                <CardDescription>
                  Requests currently being addressed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="flex items-center border rounded-lg p-4">
                        <div className="h-10 w-1 rounded-full bg-pending mr-4" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="font-medium truncate">{request.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Room {request.roomNumber} • {request.guestName}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Badge variant="outline" className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-muted-foreground">
                              Assigned to: {request.assignedToName || "Unassigned"}
                            </p>
                            <Button asChild size="sm">
                              <Link to={`/request/${request.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No in-progress requests found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Requests</CardTitle>
                <CardDescription>
                  Completed requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="flex items-center border rounded-lg p-4">
                        <div className="h-10 w-1 rounded-full bg-success mr-4" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="font-medium truncate">{request.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Room {request.roomNumber} • {request.guestName}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Badge variant="outline" className="bg-success text-success-foreground">
                                Resolved
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-muted-foreground">
                              Resolved by: {request.resolvedByName || "Unknown"}
                            </p>
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/request/${request.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No resolved requests found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default Requests;
