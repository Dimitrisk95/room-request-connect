
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StaffMember } from "@/types";
import { DeleteStaffDialog } from "./DeleteStaffDialog";
import { EditStaffDialog } from "./EditStaffDialog";
import { useStaffDeletion } from "./hooks/useStaffDeletion";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { StaffTableRow } from "./StaffTableRow";

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
  const [isDeleteProcessing, setIsDeleteProcessing] = useState(false);
  
  const { handleDeleteStaff } = useStaffDeletion({ 
    onSuccess: () => {
      toast({
        title: "Staff member deleted",
        description: selectedStaff ? 
          `${selectedStaff.name} has been removed from the system.` : 
          "Staff member has been removed from the system.",
      });
      onStaffUpdated();
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      });
    },
    setIsProcessing: setIsDeleteProcessing
  });
  
  const { resetPassword, isProcessing: isResetProcessing } = usePasswordReset({
    onSuccess: (email) => {
      toast({
        title: "Password reset email sent",
        description: `A password reset link has been sent to ${email}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    }
  });

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setEditDialogOpen(true);
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
            <StaffTableRow
              key={staff.id}
              staff={staff}
              onPasswordReset={resetPassword}
              onDeleteClick={setSelectedStaff}
              onEditClick={handleEditStaff}
              currentUserId={currentUserId}
              onDeleteConfirm={() => setDeleteDialogOpen(true)}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteStaffDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedStaff={selectedStaff}
        onConfirmDelete={() => selectedStaff && handleDeleteStaff(selectedStaff)}
        isProcessing={isDeleteProcessing}
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
