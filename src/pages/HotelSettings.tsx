
import React from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelSettingsForm from "@/components/settings/HotelSettingsForm";
import HotelCodeSection from "@/components/settings/HotelCodeSection";
import { useAuth } from "@/context";

const HotelSettings = () => {
  const { user } = useAuth();
  
  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Hotel Settings</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="access">Access Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Information</CardTitle>
                <CardDescription>
                  Manage your hotel's basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HotelSettingsForm 
                  hotelId={user?.hotelId || ""} 
                  initialData={{
                    name: "",
                    address: "",
                    contactEmail: "",
                    contactPhone: ""
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="access" className="space-y-6 pt-4">
            {user?.hotelId && (
              <HotelCodeSection 
                hotelId={user.hotelId}
                hotelName={user.name || "Hotel"} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default HotelSettings;
