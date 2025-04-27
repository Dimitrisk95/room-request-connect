
import { useState } from "react";
import { useAuth } from "@/context";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, User, Hotel, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hotelData, setHotelData] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: ""
  });

  // Load hotel data when component mounts
  useState(() => {
    const fetchHotelData = async () => {
      if (!user?.hotelId) return;

      try {
        const { data, error } = await supabase
          .from("hotels")
          .select("*")
          .eq("id", user.hotelId)
          .single();

        if (error) throw error;

        if (data) {
          setHotelData({
            name: data.name || "",
            address: data.address || "",
            contactEmail: data.contact_email || "",
            contactPhone: data.contact_phone || ""
          });
        }
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        toast({
          title: "Failed to load hotel data",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    };

    fetchHotelData();
  }, [user?.hotelId]);

  const handleHotelUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.hotelId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("hotels")
        .update({
          name: hotelData.name,
          address: hotelData.address,
          contact_email: hotelData.contactEmail,
          contact_phone: hotelData.contactPhone
        })
        .eq("id", user.hotelId);

      if (error) throw error;

      toast({
        title: "Hotel information updated",
        description: "Your hotel information has been successfully updated"
      });
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your hotel information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and hotel settings
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="hotel" className="flex items-center">
                <Hotel className="mr-2 h-4 w-4" />
                Hotel
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  View and update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={user?.name || ""}
                      disabled
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-primary" />
                      <span className="capitalize">{user?.role || ""}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="hotel" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Settings</CardTitle>
                  <CardDescription>
                    Update your hotel information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleHotelUpdate} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hotel-name">Hotel Name</Label>
                      <Input
                        id="hotel-name"
                        value={hotelData.name}
                        onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hotel-address">Address</Label>
                      <Input
                        id="hotel-address"
                        value={hotelData.address}
                        onChange={(e) => setHotelData({ ...hotelData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hotel-email">Contact Email</Label>
                      <Input
                        id="hotel-email"
                        type="email"
                        value={hotelData.contactEmail}
                        onChange={(e) => setHotelData({ ...hotelData, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hotel-phone">Contact Phone</Label>
                      <Input
                        id="hotel-phone"
                        value={hotelData.contactPhone}
                        onChange={(e) => setHotelData({ ...hotelData, contactPhone: e.target.value })}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default Settings;
