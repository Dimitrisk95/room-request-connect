
import { useState, useEffect } from "react";
import DashboardShell from "@/components/ui/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, FileText, QrCode, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";

const AccessCodes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
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

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by room number or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={downloadCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Access Codes</CardTitle>
            <CardDescription>
              All room access codes for your hotel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin mr-2" />
                <span>Loading room data...</span>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Add rooms to see their access codes here"}
                </p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Room Code</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.roomNumber}</TableCell>
                        <TableCell className="font-mono">
                          {room.room_code || "Not set"}
                        </TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell className="capitalize">{room.type}</TableCell>
                        <TableCell className="text-right">
                          {room.room_code && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(room.room_code || "")}
                              disabled={!room.room_code}
                            >
                              {copiedCode === room.room_code ? "Copied!" : "Copy Code"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default AccessCodes;
