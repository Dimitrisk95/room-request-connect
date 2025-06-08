
import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "info",
        title: "New Guest Request",
        message: "Room 205 has requested extra towels",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
        actionUrl: "/requests",
        actionText: "View Request"
      },
      {
        id: "2", 
        type: "success",
        title: "Booking Confirmed",
        message: "Room 301 booking for tonight has been confirmed",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false
      },
      {
        id: "3",
        type: "warning",
        title: "Maintenance Required",
        message: "Room 102 air conditioning needs attention",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        actionUrl: "/requests",
        actionText: "Schedule Maintenance"
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    const iconProps = { className: "h-4 w-4" };
    switch (type) {
      case "success": return <CheckCircle {...iconProps} className="h-4 w-4 text-green-500" />;
      case "error": return <AlertCircle {...iconProps} className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle {...iconProps} className="h-4 w-4 text-yellow-500" />;
      case "info": return <Info {...iconProps} className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="w-96 max-h-[80vh] shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-muted/30" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 flex-1">
                        {getIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.actionUrl && (
                              <Button variant="link" size="sm" className="h-auto p-0">
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
