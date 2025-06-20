
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const GuestRequestsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guest Requests</h1>
        <p className="text-gray-600">Handle guest requests and service tickets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Guest Requests
          </CardTitle>
          <CardDescription>
            This feature is coming soon. You'll be able to manage all guest requests here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Guest request management features will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestRequestsManagement;
