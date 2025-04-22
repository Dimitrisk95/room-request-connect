
import { useState } from "react";
import { useAuth } from "@/context";
import { createRequest } from "@/context/requests/requestHandlers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestCategory, RequestPriority } from "@/types";

const GuestRequestForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    category: "housekeeping" as RequestCategory,
    priority: "medium" as RequestPriority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "guest" || !user.roomNumber) {
      toast({
        title: "Error",
        description: "You must be logged in as a guest to submit requests",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newRequest = createRequest({
        ...requestForm,
        roomNumber: user.roomNumber,
        guestName: user.name,
        guestId: user.id,
      });
      
      toast({
        title: "Request Submitted",
        description: "Your service request has been submitted successfully",
      });
      
      // Reset form
      setRequestForm({
        title: "",
        description: "",
        category: "housekeeping" as RequestCategory,
        priority: "medium" as RequestPriority,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Service Request</CardTitle>
        <CardDescription>
          Submit a new service request for your room
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Request Title</Label>
            <Input
              id="title"
              placeholder="e.g. Extra towels needed"
              value={requestForm.title}
              onChange={(e) =>
                setRequestForm({ ...requestForm, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Details</Label>
            <Textarea
              id="description"
              placeholder="Please provide details about your request"
              value={requestForm.description}
              onChange={(e) =>
                setRequestForm({ ...requestForm, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={requestForm.category}
              onValueChange={(value) =>
                setRequestForm({ ...requestForm, category: value as RequestCategory })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="room-service">Room Service</SelectItem>
                  <SelectItem value="concierge">Concierge</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={requestForm.priority}
              onValueChange={(value) =>
                setRequestForm({ ...requestForm, priority: value as RequestPriority })
              }
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GuestRequestForm;
