
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Reservation, Room } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "@/types";
import { formatDateToString } from "@/utils/reservationUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface RoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  reservations: Reservation[];
  onReservationAdded?: (reservation: Reservation) => void;
  onReservationUpdated?: (reservation: Reservation) => void;
}

export function RoomDetailsDialog({
  open,
  onOpenChange,
  room,
  reservations,
  onReservationAdded,
  onReservationUpdated
}: RoomDetailsDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Filter reservations for this room
  const roomReservations = room ? reservations.filter(
    (res) => res.roomNumber === room?.roomNumber
  ) : [];

  console.log("Room reservations:", roomReservations);
  console.log("All reservations:", reservations);

  // Reset form when dialog opens/closes or room changes
  useEffect(() => {
    if (open && room) {
      setActiveTab("details");
      setDateRange({ from: undefined, to: undefined });
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setAdults(1);
      setChildren(0);
      setSelectedReservation(null);
      setIsEditMode(false);
    }
  }, [open, room]);

  const handleReservationSelect = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setGuestName(reservation.guestName);
    setAdults(reservation.adults);
    setChildren(reservation.children);
    
    // Extract email and phone from notes if available
    if (reservation.notes) {
      const emailMatch = reservation.notes.match(/Email: ([^,]+)/);
      const phoneMatch = reservation.notes.match(/Phone: ([^,]+)/);
      
      setGuestEmail(emailMatch ? emailMatch[1] : "");
      setGuestPhone(phoneMatch ? phoneMatch[1] : "");
    }
    
    setDateRange({
      from: new Date(reservation.checkIn),
      to: new Date(reservation.checkOut)
    });
    
    setIsEditMode(true);
    setActiveTab("reservation");
  };

  const handleCreateReservation = () => {
    if (!room || !dateRange.from || !dateRange.to || !guestName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create a new reservation
    const newReservation: Reservation = {
      id: isEditMode && selectedReservation ? selectedReservation.id : `res-${Date.now()}`,
      roomId: `room-${room.roomNumber}`,
      roomNumber: room.roomNumber,
      guestId: isEditMode && selectedReservation ? selectedReservation.guestId : `guest-${Date.now()}`,
      guestName: guestName,
      checkIn: formatDateToString(dateRange.from),
      checkOut: formatDateToString(dateRange.to),
      status: "confirmed",
      adults: adults,
      children: children,
      totalAmount: isEditMode && selectedReservation ? selectedReservation.totalAmount : Math.floor(Math.random() * 1000) + 100,
      paidAmount: isEditMode && selectedReservation ? selectedReservation.paidAmount : 0,
      notes: guestEmail || guestPhone ? `Email: ${guestEmail}, Phone: ${guestPhone}` : undefined
    };

    if (isEditMode && onReservationUpdated) {
      onReservationUpdated(newReservation);
      toast({
        title: "Reservation updated",
        description: `Successfully updated reservation for Room ${room.roomNumber}`,
      });
    } else if (onReservationAdded) {
      onReservationAdded(newReservation);
      toast({
        title: "Reservation created",
        description: `Successfully booked Room ${room.roomNumber} for ${guestName}`,
      });
    }
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDateRange({ from: undefined, to: undefined });
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setAdults(1);
    setChildren(0);
    setSelectedReservation(null);
    setIsEditMode(false);
  };

  const handleNewReservation = () => {
    setIsEditMode(false);
    setSelectedReservation(null);
    resetForm();
    setActiveTab("reservation");
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Room {room.roomNumber} - {room.type}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details">Room Details</TabsTrigger>
            <TabsTrigger value="reservation">
              {isEditMode ? "Edit Reservation" : "New Reservation"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium">Room Number</p>
                <p>{room.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Room Type</p>
                <p>{room.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Floor</p>
                <p>{room.floor}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className="mt-1">{room.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p>{room.capacity} guests</p>
              </div>
              {room.currentGuest && (
                <div>
                  <p className="text-sm font-medium">Current Guest</p>
                  <p>{room.currentGuest.name}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Reservations ({roomReservations.length})</h3>
              {roomReservations.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {roomReservations.map((reservation) => (
                    <div 
                      key={reservation.id} 
                      className="border rounded-md p-3 cursor-pointer hover:border-primary"
                      onClick={() => handleReservationSelect(reservation)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{reservation.guestName}</p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.adults + reservation.children} Guests • ${reservation.totalAmount}
                          </p>
                        </div>
                        <Badge variant={reservation.status === "confirmed" ? "outline" : "default"}>
                          {reservation.status}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">
                        {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reservations for this room</p>
              )}
              
              <Button className="mt-4 w-full" onClick={handleNewReservation}>
                Create New Reservation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reservation" className="space-y-4">
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium mb-2">Select Dates</p>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({
                        from: range.from,
                        to: range.to,
                      });
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dateValue = new Date(date);
                    dateValue.setHours(0, 0, 0, 0);
                    return dateValue < today;
                  }}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              
              {dateRange.from && dateRange.to && (
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p>
                    <strong>Check-in:</strong> {format(dateRange.from, "PPP")}
                  </p>
                  <p>
                    <strong>Check-out:</strong> {format(dateRange.to, "PPP")}
                  </p>
                </div>
              )}
              
              <div className="space-y-4 mt-6">
                <div className="grid gap-2">
                  <Label htmlFor="guestName">Guest Name *</Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="guestPhone">Phone</Label>
                    <Input
                      id="guestPhone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="adults">Adults *</Label>
                    <Select
                      value={adults.toString()}
                      onValueChange={(value) => setAdults(parseInt(value))}
                    >
                      <SelectTrigger id="adults">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="children">Children</Label>
                    <Select
                      value={children.toString()}
                      onValueChange={(value) => setChildren(parseInt(value))}
                    >
                      <SelectTrigger id="children">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "reservation" && (
            <Button 
              onClick={handleCreateReservation}
              disabled={!dateRange.from || !dateRange.to || !guestName}
            >
              {isEditMode ? "Update Reservation" : "Create Reservation"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
