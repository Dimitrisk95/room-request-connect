import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";
import { Hotel, UserCircle, ArrowRight, Building, Settings, Users } from "lucide-react";
import DrawerNavigation from "@/components/DrawerNavigation";
import AdminAccessDialog from "@/components/login/AdminAccessDialog";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (user?.role === "guest") {
        navigate(`/guest/${user.roomNumber}`);
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col relative">
      <DrawerNavigation />
      {/* Top section with logo and login + register buttons */}
      <div className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Room Request Connect</h1>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/login?mode=staff")}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Staff Login
          </Button>
          <AdminAccessDialog />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to our Hotel Services</h2>
        <p className="text-gray-600 max-w-md mb-8">
          Connect to your room to make service requests, view hotel information, and enjoy your stay.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/login?mode=guest")}
          className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg"
        >
          Connect to Your Room
        </Button>
      </div>

      {/* Hotel owners section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">For Hotel Administrators</h3>
            <p className="text-gray-600 mt-2">
              Take control of your hotel operations with our comprehensive management system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Hotel Management</h4>
              <p className="text-gray-600 text-sm">
                Easily manage your hotel properties, rooms, and services from a single dashboard
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Staff Coordination</h4>
              <p className="text-gray-600 text-sm">
                Assign tasks, manage schedules, and track performance of your hotel staff
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Service Automation</h4>
              <p className="text-gray-600 text-sm">
                Automate guest requests, maintenance tasks, and other hotel operations
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate("/register")} 
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Register Your Hotel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full p-6 text-center text-gray-500 text-sm border-t border-gray-100">
        <div className="mb-2">
          <Hotel className="h-5 w-5 text-primary inline-block mr-2" />
          <span className="font-semibold text-gray-700">Room Request Connect</span>
        </div>
        © 2025 Room Request Connect - Making your stay comfortable
      </div>
    </div>
  );
};

export default Index;
