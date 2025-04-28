
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { StaffFormData } from "./types";

export const useStaffForm = (onStaffAdded: () => void) => {
  const { createStaffAccount, user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    role: "staff",
    can_manage_rooms: false,
    can_manage_staff: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "staff",
      can_manage_rooms: false,
      can_manage_staff: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!user?.hotelId) {
      toast({
        title: "Error",
        description: "You need to set up your hotel first before adding staff members.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Generate a temporary random password (user won't need to know this)
      const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      
      await createStaffAccount(
        formData.name,
        formData.email,
        tempPassword,
        formData.role,
        user?.hotelId
      );
      
      // Update the user to mark it as needing password setup and set permissions
      const { data: newStaff } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .single();
          
      if (newStaff) {
        await supabase
          .from('users')
          .update({
            can_manage_rooms: formData.can_manage_rooms,
            can_manage_staff: formData.can_manage_staff,
            needs_password_setup: true,
            hotel_id: user.hotelId // Ensure hotel_id is explicitly set
          })
          .eq('id', newStaff.id);
          
        // Get hotel name to include in welcome email
        const { data: hotelData } = await supabase
          .from('hotels')
          .select('name')
          .eq('id', user.hotelId)
          .single();
          
        // Send welcome email with password setup instructions
        const { error: emailError } = await supabase.functions.invoke('send-password-setup', {
          body: { 
            email: formData.email,
            name: formData.name,
            hotelName: hotelData?.name || ''
          }
        });
  
        if (emailError) {
          console.error("Error sending password setup email:", emailError);
          toast({
            title: "Warning",
            description: "Staff account created, but there was an issue sending the welcome email.",
            variant: "default",
          });
        }
      }
      
      toast({
        title: "Staff account created",
        description: `${formData.name} has been added successfully. They will need to set up their password via the email sent.`,
      });
      
      resetForm();
      onStaffAdded();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to create account",
        description: error.message || "There was an error creating the staff account.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ 
      ...formData, 
      role: e.target.value as "admin" | "staff" 
    });
  };

  const handleCheckboxChange = (field: keyof Pick<StaffFormData, "can_manage_rooms" | "can_manage_staff">, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  return {
    formData,
    isSubmitting,
    open,
    setOpen,
    handleSubmit,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
  };
};
