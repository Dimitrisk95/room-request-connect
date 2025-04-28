
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
      
      // First delete from auth system if it's a real user
      if (selectedStaff.id && !selectedStaff.id.startsWith('guest-')) {
        // Delete from the users table will cascade to auth.users due to the references
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', selectedStaff.id);

        if (error) throw error;
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
