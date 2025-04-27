
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context";

export const RoomManagementHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdminRoomsPage = location.pathname === "/admin/rooms";
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        {isAdminRoomsPage && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/rooms")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-2xl font-bold tracking-tight">
          {isAdminRoomsPage ? "Edit Rooms" : "Room Management"}
        </h2>
      </div>
      
      {!isAdminRoomsPage && user?.role === "admin" && (
        <Button 
          variant="outline"
          onClick={() => navigate("/admin/rooms")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Edit Rooms
        </Button>
      )}
    </div>
  );
};
