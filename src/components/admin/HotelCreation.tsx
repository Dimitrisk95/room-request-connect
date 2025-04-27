
import { useState, useEffect } from "react";
import { useAuth } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HotelCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If admin has no hotel yet, redirect to setup
    if (user?.role === "admin" && !user?.hotelId) {
      navigate("/setup");
    }
  }, [user, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Hotel Management
        </CardTitle>
        <CardDescription>
          Manage your hotel settings and configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-4">
          Your hotel has been successfully set up. You can now manage your hotel settings, rooms, and staff.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/admin?tab=hotel-settings")} className="w-full">
          Manage Hotel Settings
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCreation;
