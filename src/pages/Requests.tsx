import { useAuth } from "@/context";
import DashboardShell from "@/components/ui/dashboard-shell";
import RequestsTable from "@/components/requests/RequestsTable";
import GuestRequestForm from "@/components/guest/GuestRequestForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { mockRequests } from "@/context/requests/requestHandlers";

const Requests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // For staff, show the request list
  // For guests, show the request form and history
  const isStaff = user?.role === "admin" || user?.role === "staff";
  const isGuest = user?.role === "guest";
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API refresh
    setTimeout(() => {
      // In a real app, this would refresh from an API
      setIsRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Request list has been refreshed."
      });
    }, 1000);
  };

  return (
    <DashboardShell>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {isGuest ? "Service Requests" : "Guest Requests"}
            </h1>
            <p className="text-muted-foreground">
              {isGuest 
                ? "Submit and track your requests for hotel services" 
                : "Manage and respond to guest service requests"
              }
            </p>
          </div>
          
          <div className="flex gap-2">
            {isStaff && (
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            
            {isGuest && (
              <Button
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "View All Requests" : "New Request"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {isGuest && showForm ? (
            <GuestRequestForm />
          ) : (
            <RequestsTable />
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Requests;
