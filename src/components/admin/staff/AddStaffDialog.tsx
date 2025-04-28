
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AddStaffDialog = ({ onStaffAdded }: { onStaffAdded: () => void }) => {
  const { createStaffAccount, user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff" as "admin" | "staff",
    can_manage_rooms: false,
    can_manage_staff: false,
  });

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
      
      setFormData({
        name: "",
        email: "",
        role: "staff",
        can_manage_rooms: false,
        can_manage_staff: false,
      });
      
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Create a new account for a staff member. They will receive an email to set up their password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "staff" })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="staff">Staff Member</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Staff members will be prompted to set up their password via the welcome email.
                  </p>
                </div>
              </div>
              
              <div className="border-l pl-6">
                <h4 className="font-medium mb-4">Permissions</h4>
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Staff Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
