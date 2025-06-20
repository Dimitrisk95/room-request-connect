
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const StaffManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600">Manage your hotel staff and their permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Staff Management
          </CardTitle>
          <CardDescription>
            This feature is coming soon. You'll be able to manage staff members here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Staff management features will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagementPage;
