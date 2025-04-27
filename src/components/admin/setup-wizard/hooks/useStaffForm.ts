
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/context/auth/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["staff", "admin"]),
});

export type FormValues = z.infer<typeof formSchema>;

export const useStaffForm = (
  updateStaffData: (data: { addStaff: boolean; createdStaff: number }) => void,
  createdStaff: number
) => {
  const { user, createStaffAccount } = useAuth();
  const { toast } = useToast();
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "staff",
    },
  });

  const handleAddStaff = async (values: FormValues) => {
    if (!user?.hotelId) {
      toast({
        title: "Error",
        description: "Hotel ID is missing. Please go back and create a hotel first.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingStaff(true);
    try {
      await createStaffAccount(
        values.name,
        values.email,
        values.password,
        values.role as UserRole,
        user.hotelId
      );

      updateStaffData({ 
        addStaff: true,
        createdStaff: createdStaff + 1
      });

      toast({
        title: "Staff added successfully",
        description: `${values.name} has been added to your hotel staff.`
      });

      form.reset({
        name: "",
        email: "",
        password: "",
        role: "staff",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add staff",
        description: error.message || "There was an error adding staff. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingStaff(false);
    }
  };

  return {
    form,
    isAddingStaff,
    handleAddStaff
  };
};
