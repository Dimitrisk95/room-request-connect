
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types";
import { StaffActionButtons } from "./StaffActionButtons";
import { DeleteStaffDialog } from "./DeleteStaffDialog";

interface StaffTableProps {
  staffMembers: StaffMember[];
  onStaffUpdated: () => void;
}

export const StaffTable = ({ staffMembers, onStaffUpdated }: StaffTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handlePasswordReset = async (staff: StaffMember) => {
    try {
      toast({
        title: "Password reset email sent",
        description: `A password reset link has been sent to ${staff.email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedStaff.id);

      if (error) throw error;

      toast({
        title: "Staff member deleted",
        description: `${selectedStaff.name} has been removed from the system.`,
      });
      
      onStaffUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell className="capitalize">{staff.role}</TableCell>
              <TableCell className="text-right">
                <StaffActionButtons
                  staff={staff}
                  onPasswordReset={handlePasswordReset}
                  onDeleteClick={(staff) => {
                    setSelectedStaff(staff);
                    setDeleteDialogOpen(true);
                  }}
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
    </div>
  );
};
