import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Request, RequestCategory, RequestPriority } from "@/types";
import { mockRequests } from "@/data/mockData";
import { AlertCircle, BellRing, Check, Calendar, Hotel, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GuestView = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const roomNumber = user?.roomNumber || "";

  // Form state for new request
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    category: "maintenance" as RequestCategory,
    priority: "medium" as RequestPriority,
  });

  // Guest's requests
  const guestRequests = mockRequests.filter(
    (req) => req.roomNumber === roomNumber
  );

  // Submit new request
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: "Your request has been sent to hotel staff.",
      duration: 5000,
    });
    // Reset form
    setNewRequest({
      title: "",
      description: "",
      category: "maintenance",
      priority: "medium",
    });
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

  // New logout and redirect handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Hotel className="h-6 w-6" />
              <h1 className="text-xl font-bold">Room Request Connect</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Disconnect
            </Button>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold">Room {roomNumber}</h2>
            <p className="text-primary-foreground/80">
              Connected with code: {roomCode}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome and information */}
          <Card className="md:col-span-3">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold">Welcome, Guest!</h2>
                  <p className="text-muted-foreground">
                    How can we help make your stay more comfortable?
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" /> Room Info
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <BellRing className="h-4 w-4" /> Services
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit new request */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Submit a Request</CardTitle>
              <CardDescription>
                Need something? Let us know how we can assist you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Request Title
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g., Extra towels needed"
                    value={newRequest.title}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Details
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about your request..."
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={newRequest.category}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          category: e.target.value as RequestCategory,
                        })
                      }
                    >
                      <option value="maintenance">Maintenance</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="room-service">Room Service</option>
                      <option value="concierge">Concierge</option>
                      <option value="amenities">Amenities</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="w-full p-2 border rounded-md"
                      value={newRequest.priority}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          priority: e.target.value as RequestPriority,
                        })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Request history */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Your Requests</CardTitle>
              <CardDescription>
                Track the status of your requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guestRequests.length > 0 ? (
                  guestRequests.map((request) => (
                    <div key={request.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{request.title}</div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(request.createdAt).toLocaleString()}
                      </div>
                      {request.status === "resolved" && (
                        <div className="flex items-center gap-1 text-success text-sm mt-2">
                          <Check className="h-4 w-4" />
                          <span>
                            Resolved by {request.resolvedByName}
                          </span>
                        </div>
                      )}
                      {request.status === "in-progress" && (
                        <div className="flex items-center gap-1 text-pending text-sm mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>
                            Being handled by {request.assignedToName}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No requests yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom nav for mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-1 flex flex-col py-3 h-auto">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Requests</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col py-3 h-auto">
            <BellRing className="h-5 w-5" />
            <span className="text-xs mt-1">Services</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col py-3 h-auto">
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Room Info</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestView;
