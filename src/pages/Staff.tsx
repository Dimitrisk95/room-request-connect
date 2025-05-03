
import React from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffTeam } from "@/components/staff/StaffTeam";
import { TasksList } from "@/components/staff/TasksList";

const Staff = () => {
  // Providing empty requests array as a temporary fix
  const emptyRequests = [];

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Team</CardTitle>
            </CardHeader>
            <CardContent>
              <StaffTeam />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tasks & Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksList 
                requests={emptyRequests}
                title="Tasks"
                description="Current tasks and assignments"
                emptyMessage="No tasks"
                emptyDescription="There are no current tasks or assignments."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Staff;
