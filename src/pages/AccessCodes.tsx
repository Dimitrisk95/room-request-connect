
import { useState, useEffect } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";

// Import our new components
import AccessCodesHeader from "@/components/access-codes/AccessCodesHeader";
import RoomCodesTable from "@/components/access-codes/RoomCodesTable";
import AccessCodesEmptyState from "@/components/access-codes/AccessCodesEmptyState";
import AccessCodesLoadingState from "@/components/access-codes/AccessCodesLoadingState";

const AccessCodes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, [user?.hotelId]);

  const fetchRooms = async () => {
    if (!user?.hotelId) {
      setRooms([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", user.hotelId);

      if (error) throw error;

      const transformedRooms: Room[] = data.map((room) => ({
        id: room.id,
        roomNumber: room.room_number,
        floor: room.floor,
        type: room.type,
        bedType: room.bed_type as "single" | "double" | "queen" | "king" | "twin" | "suite",
        status: room.status as "vacant" | "occupied" | "maintenance" | "cleaning",
        capacity: room.capacity,
        room_code: room.room_code,
      }));

      setRooms(transformedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCsv = () => {
    try {
      // Create CSV header
      const csvContent = [
        ["Room Number", "Room Code", "Floor", "Type"].join(","),
        ...rooms.map(room => {
          return [
            room.roomNumber,
            room.room_code || "N/A",
            room.floor,
            room.type
          ].join(",");
        })
      ].join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `room_codes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Room codes exported to CSV",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Error",
        description: "Failed to export room codes",
        variant: "destructive",
      });
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Access Codes</h1>
            <p className="text-muted-foreground">
              Manage and export room access codes
            </p>
          </div>
        </div>

        <AccessCodesHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          onDownloadCsv={downloadCsv}
        />

        <Card>
          <CardHeader>
            <CardTitle>Room Access Codes</CardTitle>
            <CardDescription>
              All room access codes for your hotel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AccessCodesLoadingState />
            ) : filteredRooms.length === 0 ? (
              <AccessCodesEmptyState searchTerm={searchTerm} />
            ) : (
              <RoomCodesTable rooms={filteredRooms} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default AccessCodes;
