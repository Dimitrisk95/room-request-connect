
import { useState } from "react";
import { useAuth } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, Users } from "lucide-react";
import { AddReservationDialog } from "@/components/reservations/AddReservationDialog";
import { Reservation } from "@/types";
import { useToast } from "@/hooks/use-toast";

const AdminReservationManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Check if the user has access to a hotel
  if (!user?.hotelId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservation Management</CardTitle>
          <CardDescription>
            Please create a hotel first to start managing reservations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleAddReservation = (newReservation: Reservation) => {
    setReservations(prev => [...prev, newReservation]);
    toast({
      title: "Reservation Added",
      description: `Reservation for ${newReservation.guestName} has been created successfully.`,
    });
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Reservation Management
        </CardTitle>
        <CardDescription>
          Manage all hotel reservations from this central location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-[300px]"
              />
            </div>
          </div>
          
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reservation
          </Button>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 border rounded-md bg-muted/20">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reservations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No reservations match your search." : "Start by adding your first reservation."}
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Reservation
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{reservation.guestName}</span>
                      <span className="text-sm text-muted-foreground">
                        Room {reservation.roomNumber}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {reservation.checkIn} to {reservation.checkOut}
                    </div>
                    <div className="text-sm">
                      {reservation.adults} adult{reservation.adults > 1 ? 's' : ''}
                      {reservation.children > 0 && `, ${reservation.children} child${reservation.children > 1 ? 'ren' : ''}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${reservation.totalAmount}</div>
                    <div className="text-sm text-muted-foreground">
                      Status: {reservation.status}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <AddReservationDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onReservationAdded={handleAddReservation}
        />
      </CardContent>
    </Card>
  );
};

export default AdminReservationManagement;
