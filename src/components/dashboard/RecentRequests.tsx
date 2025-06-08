
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context";
import { fetchRequestsByStatus, Request } from "@/context/requests/requestHandlers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentRequests = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.hotelId) {
      loadPendingRequests();
    }
  }, [user?.hotelId]);

  const loadPendingRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await fetchRequestsByStatus(user?.hotelId || '', 'pending');
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading requests...
            </div>
          ) : pendingRequests.length > 0 ? (
            pendingRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className={`h-2 w-2 rounded-full ${
                  request.priority === "urgent" ? "bg-destructive" :
                  request.priority === "high" ? "bg-warning" : 
                  "bg-muted"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {request.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Room {request.roomNumber} • {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/request/${request.id}`}>View</Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No pending requests
            </div>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/requests">View All Requests</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
