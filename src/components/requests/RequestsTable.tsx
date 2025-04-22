
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { mockRequests, Request } from "@/context/requests/requestHandlers"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowUpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RequestStatus } from "@/types";

const RequestsTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([...mockRequests]);
  const [isStaffView, setIsStaffView] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setRequests([...mockRequests]);
    setIsStaffView(user?.role === "admin" || user?.role === "staff");
  }, [user]);

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    // Create a new array with the updated request
    const updatedRequests = requests.map(req => 
      req.id === requestId ? {...req, status: newStatus} : req
    );
    
    // Update the local state
    setRequests(updatedRequests);
    
    // Also update the mock data (with a new array to avoid mutation)
    const updatedMockRequests = mockRequests.map(req => 
      req.id === requestId ? {...req, status: newStatus} : req
    );
    
    // Since we can't reassign the imported mockRequests, update it by modifying its contents
    mockRequests.length = 0;
    mockRequests.push(...updatedMockRequests);
    
    toast({
      title: "Request Updated",
      description: `Request status changed to ${newStatus}`,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive" className="bg-red-500">Urgent</Badge>;
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1"><ArrowUpCircle className="h-3 w-3" /> In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Requests</CardTitle>
          <CardDescription>
            There are currently no guest requests in the system.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Requests</CardTitle>
        <CardDescription>
          {isStaffView 
            ? "Manage and respond to guest requests" 
            : "Track your service requests"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {isStaffView && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.roomNumber}</TableCell>
                <TableCell>{request.guestName}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{request.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{request.category}</Badge>
                </TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                {isStaffView && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {request.status === "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(request.id, "in-progress")}
                        >
                          Process
                        </Button>
                      )}
                      {(request.status === "pending" || request.status === "in-progress") && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700" 
                          onClick={() => handleStatusChange(request.id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;
