import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types";
import { StaffActionButtons } from "./StaffActionButtons";
import { DeleteStaffDialog } from "./DeleteStaffDialog";
import { EditStaffDialog } from "./EditStaffDialog";

interface StaffTableProps {
  staffMembers: StaffMember[];
  onStaffUpdated: () => void;
  currentUserId: string;
}

export const StaffTable = ({ staffMembers, onStaffUpdated, currentUserId }: StaffTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasswordReset = async (staff: StaffMember) => {
    try {
      setIsProcessing(true);
      
      // Call the password reset edge function
      const { error } = await supabase.functions.invoke('reset-password-email', {
        body: { 
          email: staff.email,
          name: staff.name
        }
      });

      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: `A password reset link has been sent to ${staff.email}`,
      });
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setEditDialogOpen(true);
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
    
    try {
      setIsProcessing(true);
      
      // Step 1: Try to use the database function to delete from the users table
      try {
        const { data, error: rpcError } = await supabase.rpc(
          'delete_user_and_related_data' as any, 
          { user_id_param: selectedStaff.id }
        );
        
        if (rpcError) {
          console.error("RPC function error:", rpcError);
          // Fall back to regular deletion
          await manualDeletion(selectedStaff);
        }
      } catch (rpcErr) {
        console.error("RPC function error:", rpcErr);
        // Fall back to regular deletion
        await manualDeletion(selectedStaff);
      }
      
      // Step 2: Delete the user from Supabase Auth system
      try {
        const { error: authDeleteError } = await supabase.functions.invoke('delete-user-auth', {
          body: { 
            userId: selectedStaff.id,
            email: selectedStaff.email
          }
        });
        
        if (authDeleteError) {
          console.error("Error deleting user from Auth:", authDeleteError);
          // We continue anyway because the main users table is already deleted
          // We'll just show a warning
          toast({
            title: "Partial deletion",
            description: "User removed from system but may still exist in authentication database.",
            variant: "warning",
          });
        }
      } catch (authErr) {
        console.error("Error calling delete-user-auth function:", authErr);
        // We continue anyway as above
      }
      
      toast({
        title: "Staff member deleted",
        description: `${selectedStaff.name} has been removed from the system.`,
      });
      
      onStaffUpdated();
      
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
      setIsProcessing(false);
    }
  };
  
  // Manual deletion as fallback
  const manualDeletion = async (staff: StaffMember) => {
    // First, delete any entries in the user_audit_log table that reference this user
    const { error: auditLogError } = await supabase
      .from('user_audit_log')
      .delete()
      .eq('user_id', staff.id);
      
    if (auditLogError) {
      console.error("Error deleting audit logs:", auditLogError);
      // Try using the Edge Function instead
      try {
        const { error: functionError } = await supabase.functions.invoke('delete-staff', {
          body: { userId: staff.id }
        });
        
        if (!functionError) {
          return; // Success via edge function
        } else {
          throw functionError;
        }
      } catch (fnError) {
        console.error("Edge function error:", fnError);
        // Continue with direct delete attempt
      }
    }
    
    // Now delete the user from the users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', staff.id);

    if (error) {
      throw error;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell className="capitalize">
                <Badge variant={staff.role === 'admin' ? 'default' : 'secondary'}>
                  {staff.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {staff.can_manage_rooms && (
                    <Badge variant="outline">Manage Rooms</Badge>
                  )}
                  {staff.can_manage_staff && (
                    <Badge variant="outline">Manage Staff</Badge>
                  )}
                  {!staff.can_manage_rooms && !staff.can_manage_staff && (
                    <span className="text-muted-foreground text-sm">No special permissions</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <StaffActionButtons
                  staff={staff}
                  onPasswordReset={handlePasswordReset}
                  onDeleteClick={(staff) => {
                    setSelectedStaff(staff);
                    setDeleteDialogOpen(true);
                  }}
                  onEditClick={handleEditStaff}
                  currentUserId={currentUserId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteStaffDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedStaff={selectedStaff}
        onConfirmDelete={handleDeleteStaff}
        isProcessing={isProcessing}
      />

      <EditStaffDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        staff={selectedStaff}
        onStaffUpdated={onStaffUpdated}
      />
    </div>
  );
};
