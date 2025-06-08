
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { 
  fetchRequests, 
  updateRequestStatus, 
  addRequestNote,
  Request 
} from "@/context/requests/requestHandlers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowUpCircle,
  MessageSquare,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RequestStatus } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const RequestsTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaffView, setIsStaffView] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.hotelId) {
      loadRequests();
    }
  }, [user?.hotelId]);

  useEffect(() => {
    setIsStaffView(user?.role === "admin" || user?.role === "staff");
  }, [user]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const fetchedRequests = await fetchRequests(user?.hotelId || '');
      
      // Filter by user role
      let filteredRequests = fetchedRequests;
      if (user?.role === "guest" && user?.roomNumber) {
        filteredRequests = fetchedRequests.filter(req => req.roomNumber === user.roomNumber);
      }
      
      setRequests(filteredRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      const updatedRequest = await updateRequestStatus(
        requestId, 
        newStatus, 
        user.id, 
        user.name
      );
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      
      toast({
        title: "Request Updated",
        description: `Request status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async (requestId: string) => {
    if (!note.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdating(true);
      const noteWithAuthor = `${user?.name}: ${note}`;
      await addRequestNote(requestId, noteWithAuthor);
      
      // Reload requests to get updated notes
      await loadRequests();
      
      setNote("");
      setSelectedRequest(null);
      
      toast({
        title: "Note Added",
        description: "Your note has been added to the request",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
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
      case "resolved":
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Requests</CardTitle>
          <CardDescription>
            Fetching the latest guest requests...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

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
                    {request.assignedToName && (
                      <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        Assigned to: {request.assignedToName}
                      </div>
                    )}
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
                          disabled={isUpdating}
                        >
                          Claim
                        </Button>
                      )}
                      {(request.status === "pending" || request.status === "in-progress") && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700" 
                          onClick={() => handleStatusChange(request.id, "resolved")}
                          disabled={isUpdating}
                        >
                          Complete
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Note to Request</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium">{request.title}</p>
                              <p className="text-sm text-muted-foreground">Room {request.roomNumber} • {request.guestName}</p>
                            </div>
                            
                            {request.notes && request.notes.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Previous Notes:</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {request.notes.map((note, index) => (
                                    <div key={index} className="text-sm p-2 bg-muted rounded">
                                      {note}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <Textarea
                                placeholder="Add a note about this request..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleAddNote(request.id)}
                                disabled={isUpdating || !note.trim()}
                              >
                                Add Note
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedRequest(null);
                                  setNote("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
