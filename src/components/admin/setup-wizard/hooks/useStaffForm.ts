
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

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
    console.log("Adding staff member to setup data:", values);
    setIsAddingStaff(true);
    
    try {
      // During setup wizard, we just store the staff data for later creation
      // The actual staff accounts will be created after the hotel is created
      
      // Simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      updateStaffData({ 
        addStaff: true,
        createdStaff: createdStaff + 1
      });

      toast({
        title: "Staff member added",
        description: `${values.name} will be created when you complete the hotel setup.`
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
