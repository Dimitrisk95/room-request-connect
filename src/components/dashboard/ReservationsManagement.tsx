
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const ReservationsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-600">Manage bookings and check-ins</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Reservations Management
          </CardTitle>
          <CardDescription>
            This feature is coming soon. You'll be able to manage all reservations here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Reservation management features will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsManagement;
