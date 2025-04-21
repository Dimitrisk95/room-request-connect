
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Save } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  hotelName: z.string().min(2, {
    message: "Hotel name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const HotelSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Default values would come from API in a real implementation
  const defaultValues: FormValues = {
    hotelName: user?.hotelId || "Your Hotel Name",
    address: "123 Hotel Street, City, Country",
    contactEmail: "contact@yourhotel.com",
    contactPhone: "+1 123 456 7890",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    
    try {
      // In a real app, this would save to a database
      console.log("Saving hotel settings:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your hotel settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "There was an error saving your hotel settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Hotel Information
        </CardTitle>
        <CardDescription>
          Customize your hotel's basic information
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hotelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hotel name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed throughout the application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hotel address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 123 456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default HotelSettings;
