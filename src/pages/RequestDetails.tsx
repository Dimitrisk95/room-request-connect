
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockRequests } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle, Clock, MapPin, MessageSquare, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Request, RequestStatus } from "@/types";

const RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the request by ID
  const request = mockRequests.find(req => req.id === id) || null;
  
  // State for the resolution note
  const [resolutionNote, setResolutionNote] = useState("");
  const [newStatus, setNewStatus] = useState<RequestStatus | "">("");
  
  // If request not found
  if (!request) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">Request Not Found</h2>
          <p className="text-muted-foreground mt-2">The request you're looking for doesn't exist or has been deleted.</p>
          <Button className="mt-6" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardShell>
    );
  }

  // Handle status change
  const handleStatusChange = (status: RequestStatus) => {
    // In a real app, this would update the request in the database
    setNewStatus(status);
    
    toast({
      title: "Status Updated",
      description: `Request status changed to ${status}`,
    });
  };

  // Handle resolution submission
  const handleResolution = () => {
    if (!resolutionNote.trim()) {
      toast({
        title: "Resolution Note Required",
        description: "Please add a note explaining how you resolved this request.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would update the request in the database
    toast({
      title: "Request Resolved",
      description: "The request has been marked as resolved.",
    });
    
    // Navigate back to staff view
    navigate("/staff");
  };

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

  // Calculate time elapsed since request creation
  const getTimeElapsed = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 1) {
      return `${Math.floor(diffHrs * 60)} minutes ago`;
    } else if (diffHrs < 24) {
      return `${Math.floor(diffHrs)} hours ago`;
    } else {
      return `${Math.floor(diffHrs / 24)} days ago`;
    }
  };

  // Check if the current user can claim this request
  const canClaim = request.status === "pending" && !request.assignedTo;
  // Check if the current user can resolve this request
  const canResolve = (request.status === "in-progress" || request.status === "pending") && 
                    (request.assignedTo === user?.id || !request.assignedTo);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Request Details</h1>
            <p className="text-muted-foreground">
              Request #{id?.split("-")[1]} • Submitted {getTimeElapsed(request.createdAt)}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{request.title}</CardTitle>
                  <CardDescription>
                    Category: {request.category.replace("-", " ")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(newStatus || request.status)}>
                    {newStatus || request.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm">{request.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Request Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Request Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {request.assignedTo && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-pending/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-pending" />
                      </div>
                      <div>
                        <p className="font-medium">Assigned to {request.assignedToName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === "in-progress" && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-pending/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-pending" />
                      </div>
                      <div>
                        <p className="font-medium">In Progress</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === "resolved" && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Resolved by {request.resolvedByName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.resolvedAt || "").toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {request.notes && request.notes.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <div className="space-y-2">
                    {request.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-muted/20 rounded-md text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {canResolve && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {request.status !== "in-progress" && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatusChange("in-progress")}
                      >
                        Mark as In Progress
                      </Button>
                    )}
                    
                    <Button 
                      variant="default"
                      onClick={() => handleStatusChange("resolved")}
                    >
                      Mark as Resolved
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusChange("cancelled")}
                    >
                      Cancel Request
                    </Button>
                  </div>
                </div>
              )}

              {newStatus === "resolved" && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Resolution Details</h3>
                  <Textarea
                    placeholder="Describe how the request was resolved..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="mb-4"
                    rows={4}
                  />
                  <Button onClick={handleResolution}>Submit Resolution</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guest and room information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Guest & Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Guest</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{request.guestName}</p>
                    <p className="text-sm text-muted-foreground">Guest</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Room</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Room {request.roomNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Floor {Math.floor(Number(request.roomNumber) / 100)}
                    </p>
                  </div>
                </div>
              </div>

              {canClaim && (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleStatusChange("in-progress")}
                >
                  Claim This Request
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default RequestDetails;
