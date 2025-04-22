
import { Request } from "@/context/requests/requestHandlers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Bell, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface TasksListProps {
  requests: Request[];
  title: string;
  description: string;
  emptyMessage: string;
  emptyDescription: string;
}

export const TasksList = ({ requests, title, description, emptyMessage, emptyDescription }: TasksListProps) => {
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

  const IconComponent = ({ type }: { type: string }) => {
    switch (type) {
      case "my-tasks":
        return <Clock className="h-4 w-4" />;
      case "available":
        return <Bell className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const buttonText = (type: string) => {
    switch (type) {
      case "my-tasks":
        return "Handle Request";
      case "available":
        return "Claim Request";
      default:
        return "View Details";
    }
  };

  const getButtonType = (requestType: string) => {
    if (requestType === "completed") return "available";
    return requestType;
  };

  return (
    <>
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
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
                  <IconComponent type={getButtonType(title.toLowerCase())} />
                  <span>
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <Button asChild>
                  <Link to={`/request/${request.id}`}>{buttonText(getButtonType(title.toLowerCase()))}</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p>{emptyMessage}</p>
            <p className="text-sm">{emptyDescription}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TasksList;
