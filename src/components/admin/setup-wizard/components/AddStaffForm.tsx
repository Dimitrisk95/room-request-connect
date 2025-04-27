
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useStaffForm, FormValues } from "../hooks/useStaffForm";

interface AddStaffFormProps {
  updateStaffData: (data: { addStaff: boolean; createdStaff: number }) => void;
  createdStaff: number;
}

export const AddStaffForm = ({ updateStaffData, createdStaff }: AddStaffFormProps) => {
  const { form, isAddingStaff, handleAddStaff } = useStaffForm(updateStaffData, createdStaff);

  return (
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
                <select
                  id="role"
                  className="w-full p-2 border rounded-md"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                </select>
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
  );
};
