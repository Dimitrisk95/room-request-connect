
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StaffMember } from "@/types";
import { StaffActionButtons } from "./StaffActionButtons";

interface StaffTableRowProps {
  staff: StaffMember;
  onPasswordReset: (staff: StaffMember) => void;
  onDeleteClick: (staff: StaffMember) => void;
  onEditClick: (staff: StaffMember) => void;
  currentUserId: string;
  onDeleteConfirm: () => void;
}

export const StaffTableRow = ({
  staff,
  onPasswordReset,
  onDeleteClick,
  onEditClick,
  currentUserId,
  onDeleteConfirm,
}: StaffTableRowProps) => {
  return (
    <TableRow>
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
          onPasswordReset={onPasswordReset}
          onDeleteClick={(staff) => {
            onDeleteClick(staff);
            onDeleteConfirm();
          }}
          onEditClick={onEditClick}
          currentUserId={currentUserId}
        />
      </TableCell>
    </TableRow>
  );
};
