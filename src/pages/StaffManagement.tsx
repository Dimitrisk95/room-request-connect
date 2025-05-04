
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { StaffTable } from "@/components/admin/staff/StaffTable";
import { AddStaffDialog } from "@/components/admin/staff/AddStaffDialog";
import { StaffMember } from "@/types";
import { Shield } from "lucide-react";
import RoleManagement from "@/components/admin/role-management";
import { ResetDatabaseButton } from "@/components/admin/ResetDatabaseButton";

const StaffManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      if (!user?.hotelId) {
        toast({
          title: "Error",
          description: "No hotel associated with your account",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Only fetch staff members for the current user's hotel, excluding admin accounts
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at, can_manage_rooms, can_manage_staff, hotel_id')
        .eq('hotel_id', user.hotelId)
        .eq('role', 'staff')  // Only fetch staff members, excluding admins
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setStaffMembers(data as StaffMember[]);
    } catch (error: any) {
      console.error('Error fetching staff members:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch staff members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.hotelId) {
      fetchStaffMembers();
    }
  }, [user?.hotelId]);

  // Only admin or staff with staff management permission can access this page
  const canManageStaff = user?.role === "admin" || user?.can_manage_staff;
  
  if (!canManageStaff) {
    return (
      <DashboardShell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access the staff management page.</p>
        </div>
      </DashboardShell>
    );
  }

  // No hotel associated with the account
  if (!user?.hotelId) {
    return (
      <DashboardShell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">No Hotel Found</h1>
          <p>You need to set up your hotel first to manage staff members.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Staff Management
          </h1>
          <div className="flex gap-2">
            <AddStaffDialog onStaffAdded={fetchStaffMembers} />
            {user?.role === "admin" && <ResetDatabaseButton />}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>
              Manage your staff members and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : staffMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No staff members found. Use the "Add Staff Member" button to create your first staff account.
              </div>
            ) : (
              <StaffTable 
                staffMembers={staffMembers} 
                onStaffUpdated={fetchStaffMembers}
                currentUserId={user?.id || ''}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default StaffManagement;
