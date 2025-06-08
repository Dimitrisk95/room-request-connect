
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, Send, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackItem {
  id: string;
  guestName: string;
  roomNumber: string;
  rating: number;
  category: string;
  comment: string;
  timestamp: Date;
  responded: boolean;
  response?: string;
}

interface FeedbackFormProps {
  roomNumber: string;
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'timestamp' | 'responded'>) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ roomNumber, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      guestName: guestName || "Anonymous",
      roomNumber,
      rating,
      category: category || "General",
      comment
    });

    // Reset form
    setRating(0);
    setCategory("");
    setComment("");
    setGuestName("");

    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! We appreciate your input."
    });
  };

  const categories = [
    "Room Cleanliness",
    "Service Quality", 
    "Amenities",
    "Staff Friendliness",
    "Check-in/Check-out",
    "Food & Beverage",
    "General"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Share Your Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="guest-name">Name (Optional)</Label>
            <Input
              id="guest-name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <Label>Overall Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="comment">Comments</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

interface FeedbackListProps {
  feedbacks: FeedbackItem[];
  onRespond: (id: string, response: string) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, onRespond }) => {
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({});

  const handleRespond = (id: string) => {
    const response = responseText[id];
    if (response?.trim()) {
      onRespond(id, response);
      setResponseText(prev => ({ ...prev, [id]: "" }));
    }
  };

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: feedbacks.length > 0 
      ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100 
      : 0
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                Based on {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{feedback.guestName}</span>
                    <Badge variant="outline">Room {feedback.roomNumber}</Badge>
                    <Badge variant="secondary">{feedback.category}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {feedback.timestamp.toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-muted-foreground mb-4">{feedback.comment}</p>
              
              {feedback.responded ? (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Management Response:</p>
                  <p className="text-sm">{feedback.response}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write a response to this feedback..."
                    value={responseText[feedback.id] || ""}
                    onChange={(e) => setResponseText(prev => ({ 
                      ...prev, 
                      [feedback.id]: e.target.value 
                    }))}
                    rows={2}
                  />
                  <Button 
                    size="sm"
                    onClick={() => handleRespond(feedback.id)}
                    disabled={!responseText[feedback.id]?.trim()}
                  >
                    Send Response
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { FeedbackForm, FeedbackList };
export type { FeedbackItem };
