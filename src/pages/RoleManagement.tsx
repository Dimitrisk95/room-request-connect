
import React from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context";
import { RoleManagementPage } from "@/components/admin/role-management";

const RoleManagement = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  if (!isAdmin) {
    return (
      <DashboardShell>
        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-red-500">Access Denied</CardTitle>
              <CardDescription>
                You do not have permission to access the role management page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Only administrators can manage staff roles and permissions.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }
  
  return (
    <DashboardShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Role Management</h1>
        <RoleManagementPage />
      </div>
    </DashboardShell>
  );
};

export default RoleManagement;
