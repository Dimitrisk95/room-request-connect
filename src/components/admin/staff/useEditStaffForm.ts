
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
    setFormData({ ...formData, [field]: checked });
  };

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

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
  };
};
