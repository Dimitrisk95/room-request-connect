
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { StaffMember } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { UseEditStaffFormReturn } from "./types";

export const useEditStaffForm = (
  staff: StaffMember | null,
  onStaffUpdated: () => void,
  onOpenChange: (open: boolean) => void
): UseEditStaffFormReturn => {
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
      console.log("Editing staff member with permissions:", {
        id: staff.id,
        name: staff.name,
        can_manage_rooms: staff.can_manage_rooms,
        can_manage_staff: staff.can_manage_staff
      });
      
      setFormData({
        name: staff.name,
        email: staff.email,
        role: staff.role,
        can_manage_rooms: staff.can_manage_rooms || false,
        can_manage_staff: staff.can_manage_staff || false,
      });
    }
  }, [staff]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role: e.target.value as "admin" | "staff" });
  };

  const handleCheckboxChange = (
    field: keyof Pick<StaffMember, "can_manage_rooms" | "can_manage_staff">,
    checked: boolean
  ) => {
    console.log(`Setting ${field} permission to:`, checked);
    setFormData({ ...formData, [field]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staff) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Saving staff member with permissions:", {
        id: staff.id, 
        name: formData.name,
        can_manage_rooms: formData.can_manage_rooms,
        can_manage_staff: formData.can_manage_staff
      });

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
        description: `${formData.name}'s information and permissions have been successfully updated.`,
      });
      
      onStaffUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating staff:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
  };
};
