
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GuestHotelConnectForm from "@/components/login/GuestHotelConnectForm";
import { useLogin } from "@/hooks/use-login";

const GuestConnect = () => {
  const navigate = useNavigate();
  const { isLoading, handleGuestLogin } = useLogin();
  
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hotel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Roomlix</h1>
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
            onConnect={(hotelCode, roomCode) => handleGuestLogin({ hotelCode, roomCode })}
          />
        </div>
      </div>
    </div>
  );
};

export default GuestConnect;
