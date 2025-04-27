
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";

export const RoomManagementHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold tracking-tight">Room Management</h2>
      {user?.role === "admin" && (
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
