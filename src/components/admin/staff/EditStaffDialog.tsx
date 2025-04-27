
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffMember } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  onStaffUpdated: () => void;
}

export const EditStaffDialog = ({
  open,
  onOpenChange,
  staff,
  onStaffUpdated,
}: EditStaffDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: "",
    email: "",
    role: "staff",
    can_manage_rooms: false,
    can_manage_staff: false,
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        role: staff.role,
        can_manage_rooms: staff.can_manage_rooms || false,
        can_manage_staff: staff.can_manage_staff || false,
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staff) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          can_manage_rooms: formData.can_manage_rooms,
          can_manage_staff: formData.can_manage_staff,
        })
        .eq('id', staff.id);

      if (error) throw error;
      
      toast({
        title: "Staff updated",
        description: `${formData.name}'s information has been successfully updated.`,
      });
      
      onStaffUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> 
            Edit Staff Member
          </DialogTitle>
          <DialogDescription>
            Update staff information and permissions. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "staff" })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="staff">Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="my-2 border-t pt-4">
              <h4 className="mb-4 font-medium">Permissions</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manage-rooms"
                    checked={formData.can_manage_rooms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, can_manage_rooms: checked === true })
                    }
                  />
                  <Label htmlFor="manage-rooms">Can manage rooms</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manage-staff"
                    checked={formData.can_manage_staff}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, can_manage_staff: checked === true })
                    }
                  />
                  <Label htmlFor="manage-staff">Can manage staff</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
