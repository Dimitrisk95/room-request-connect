
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StaffMember } from "./types";
import { StaffTableRow } from "./StaffTableRow";

// Mock data - in a real app this would come from an API
const mockStaffMembers: StaffMember[] = [
  { id: "1", name: "John Doe", email: "john@hotel.com", role: "admin" },
  { id: "2", name: "Jane Smith", email: "jane@hotel.com", role: "staff" },
  { id: "3", name: "Alice Johnson", email: "alice@hotel.com", role: "staff" },
  { id: "4", name: "Bob Williams", email: "bob@hotel.com", role: "staff" },
];

export const StaffTable = () => {
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<"admin" | "staff">("staff");
  const [newPassword, setNewPassword] = useState("");

  const handleRoleChange = async (staffId: string, newRole: "admin" | "staff") => {
    // In a real app, this would be an API call
    setStaffMembers(staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, role: newRole } : staff
    ));
    
    toast({
      title: "Role updated",
      description: `Staff member's role has been changed to ${newRole}.`,
    });
  };

  const handlePasswordReset = async () => {
    if (!selectedStaff) return;
    
    // In a real app, this would be an API call
    console.log(`Resetting password for ${selectedStaff.name} to: ${newPassword}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Password updated",
      description: `Password has been reset for ${selectedStaff.name}.`,
    });
    
    setNewPassword("");
    setSelectedStaff(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staffMembers.map((staff) => (
          <StaffTableRow 
            key={staff.id}
            staff={staff}
            onRoleChange={handleRoleChange}
            onPasswordReset={() => setSelectedStaff(staff)}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
            newRole={newRole}
            setNewRole={setNewRole}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            handlePasswordReset={handlePasswordReset}
          />
        ))}
      </TableBody>
    </Table>
  );
};
