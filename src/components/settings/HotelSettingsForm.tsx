
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(5, "Please enter a valid phone number"),
});

type FormValues = z.infer<typeof formSchema>;

interface HotelSettingsFormProps {
  hotelId: string;
  initialData: {
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
  };
}

const HotelSettingsForm = ({ hotelId, initialData }: HotelSettingsFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("hotels")
        .update({
          name: data.name,
          address: data.address,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone,
        })
        .eq("id", hotelId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hotel information has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update hotel information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Hotel Information
        </CardTitle>
        <CardDescription>
          Update your hotel's basic information
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Input {...field} />
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
                    <Input type="email" {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default HotelSettingsForm;
