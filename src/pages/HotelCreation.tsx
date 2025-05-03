
import React from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HotelCreation = () => {
  const navigate = useNavigate();

  return (
    <DashboardShell>
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Create New Hotel
            </CardTitle>
            <CardDescription>
              Set up your hotel information and begin managing your property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center py-4">
              Use this page to create and configure your hotel. This component redirects to the setup wizard.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate("/admin-dashboard")} className="w-full max-w-sm">
                Go to Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default HotelCreation;
