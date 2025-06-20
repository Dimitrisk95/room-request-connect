
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings, Hotel, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const hotelProfileSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  address: z.string().optional(),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
});

type HotelProfileValues = z.infer<typeof hotelProfileSchema>;

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hotelCode, setHotelCode] = useState("");

  const form = useForm<HotelProfileValues>({
    resolver: zodResolver(hotelProfileSchema),
    defaultValues: {
      name: "",
      address: "",
      contact_email: "",
      contact_phone: "",
    },
  });

  useEffect(() => {
    const fetchHotelData = async () => {
      if (!user?.hotelId) return;

      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', user.hotelId)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            name: data.name || "",
            address: data.address || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
          });
          setHotelCode(data.hotel_code || "");
        }
      } catch (error) {
        console.error('Error fetching hotel data:', error);
      }
    };

    fetchHotelData();
  }, [user?.hotelId, form]);

  const onSubmit = async (values: HotelProfileValues) => {
    if (!user?.hotelId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotels')
        .update({
          name: values.name,
          address: values.address || null,
          contact_email: values.contact_email || null,
          contact_phone: values.contact_phone || null,
        })
        .eq('id', user.hotelId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hotel profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating hotel:', error);
      toast({
        title: "Error",
        description: "Failed to update hotel profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHotelCode = async () => {
    if (!user?.hotelId) return;

    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { error } = await supabase
        .from('hotels')
        .update({ hotel_code: code })
        .eq('id', user.hotelId);

      if (error) throw error;

      setHotelCode(code);
      toast({
        title: "Success",
        description: "Hotel code generated successfully",
      });
    } catch (error) {
      console.error('Error generating hotel code:', error);
      toast({
        title: "Error",
        description: "Failed to generate hotel code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your hotel settings and preferences</p>
      </div>

      {/* Hotel Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hotel className="mr-2 h-5 w-5" />
            Hotel Profile Information
          </CardTitle>
          <CardDescription>
            Update your hotel's basic information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Grand Hotel" {...field} />
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
                      <Input placeholder="123 Main Street, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="info@hotel.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Hotel Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Hotel Code
          </CardTitle>
          <CardDescription>
            This code allows guests to connect to your hotel during login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 p-3 rounded-lg text-center">
                {hotelCode || "No code generated"}
              </div>
            </div>
            <Button onClick={generateHotelCode} variant="outline">
              {hotelCode ? "Regenerate" : "Generate"} Code
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Share this code with your guests so they can access the guest portal. 
            Keep this code secure and regenerate it if compromised.
          </p>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Additional Settings
          </CardTitle>
          <CardDescription>
            More configuration options will be available here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Additional settings and configuration options will be available in future updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
