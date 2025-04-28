
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
      // Generate a simple password for testing
      const tempPassword = "password123"; // Simple password for testing
      
      console.log("Creating staff account with email:", formData.email, "and permissions:", {
        can_manage_rooms: formData.can_manage_rooms,
        can_manage_staff: formData.can_manage_staff
      });
      
      const userData = await createStaffAccount(
        formData.name,
        formData.email,
        tempPassword,
        formData.role,
        user?.hotelId
      );
      
      // Update the user to set permissions
      if (userData) {
        const { data, error } = await supabase
          .from('users')
          .update({
            can_manage_rooms: formData.can_manage_rooms,
            can_manage_staff: formData.can_manage_staff,
            needs_password_setup: true, // Staff will need to set up a password
            hotel_id: user.hotelId
          })
          .eq('email', formData.email);
          
        if (error) {
          console.error("Error updating staff permissions:", error);
          throw error;
        }
        
        console.log("Staff account created and permissions set successfully");
          
        toast({
          title: "Staff account created",
          description: `${formData.name} has been added successfully. They can log in with email: ${formData.email} and password: ${tempPassword}`,
        });
      }
      
      resetForm();
      onStaffAdded();
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to create staff account:", error);
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
