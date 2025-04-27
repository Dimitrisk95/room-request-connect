
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { SetupData } from "../SetupWizard";
import { Users, Plus, Check, Loader2 } from "lucide-react";
import { UserRole } from "@/context/auth/types";

interface StaffSetupStepProps {
  staffData: SetupData["staff"];
  updateStaffData: (data: Partial<SetupData["staff"]>) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["staff", "admin"]),
});

type FormValues = z.infer<typeof formSchema>;

const StaffSetupStep: React.FC<StaffSetupStepProps> = ({
  staffData,
  updateStaffData,
  onNext,
  onSkip,
  onBack
}) => {
  const { user, createStaffAccount } = useAuth();
  const { toast } = useToast();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [createdStaff, setCreatedStaff] = useState(staffData.createdStaff);

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

      setCreatedStaff(prev => prev + 1);
      updateStaffData({ 
        addStaff: true,
        createdStaff: staffData.createdStaff + 1
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-primary">
        <Users className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Add Staff</h2>
      </div>
      
      <p className="text-muted-foreground">
        Add staff members to your hotel who will help manage operations. You can add more staff members later.
      </p>

      {createdStaff > 0 && (
        <Card className="bg-muted/30 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium">
                {createdStaff} {createdStaff === 1 ? 'Staff Member' : 'Staff Members'} Added
              </h3>
              <p className="text-sm text-muted-foreground">
                You can add more staff or continue with setup
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Staff member's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="staff@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full mt-2"
              disabled={isAddingStaff}
            >
              {isAddingStaff ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Staff...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        {createdStaff > 0 ? (
          <Button onClick={onNext}>Continue</Button>
        ) : (
          <Button variant="secondary" onClick={onSkip}>
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffSetupStep;
