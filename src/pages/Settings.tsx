
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Hotel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileSettings from "@/components/settings/ProfileSettings";
import HotelSettingsForm from "@/components/settings/HotelSettingsForm";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hotelData, setHotelData] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: ""
  });

  useEffect(() => {
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
            <ProfileSettings user={user} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="hotel" className="space-y-4 mt-4">
              <HotelSettingsForm 
                hotelId={user?.hotelId || ""} 
                initialData={hotelData}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default Settings;
