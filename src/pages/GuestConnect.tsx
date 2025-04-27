
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel } from "lucide-react";
import DrawerNavigation from "@/components/DrawerNavigation";
import GuestHotelConnectForm from "@/components/login/GuestHotelConnectForm";
import { useLogin } from "@/hooks/use-login";

const GuestConnect = () => {
  const navigate = useNavigate();
  const { isLoading, handleGuestLogin } = useLogin();
  
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <DrawerNavigation />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hotel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Room Request Connect</h1>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Connect to Your Room
            </h2>
            <p className="text-muted-foreground">
              Enter your hotel and room codes to connect to hotel services
            </p>
          </div>

          <GuestHotelConnectForm
            isLoading={isLoading}
            onConnect={handleGuestLogin}
          />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you hotel staff?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary underline hover:text-primary/90"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestConnect;
