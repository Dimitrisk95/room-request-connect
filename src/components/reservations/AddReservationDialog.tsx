
import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockRooms, mockReservations } from "@/data/mockData";
import { DateRange, Room } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { isRoomAvailable, calculateNights, formatDateToString } from "@/utils/reservationUtils";

interface AddReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReservationDialog({ open, onOpenChange }: AddReservationDialogProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  // Filter available rooms based on the selected date range
  const availableRooms = mockRooms.filter((room) => {
    return isRoomAvailable(room, dateRange, mockReservations);
  });

  const handleSubmit = () => {
    if (!dateRange.from || !dateRange.to || !selectedRoom || !guestName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally save the reservation to the database
    // For now, we'll just show a success message
    toast({
      title: "Reservation created",
      description: `Successfully booked Room ${selectedRoom} for ${guestName} from ${format(dateRange.from, "PP")} to ${format(dateRange.to, "PP")}`,
    });

    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedRoom("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setAdults(1);
    setChildren(0);
  };

  const handleRoomSelect = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
          <DialogDescription>
            Create a new reservation by selecting dates, room, and guest information.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="dates" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="dates">1. Select Dates</TabsTrigger>
            <TabsTrigger value="room" disabled={!dateRange.from || !dateRange.to}>
              2. Choose Room
            </TabsTrigger>
            <TabsTrigger value="guest" disabled={!selectedRoom}>
              3. Guest Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dates" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select check-in and check-out dates for the reservation
              </p>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) setDateRange(range);
                  }}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
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
                  <p>
                    <strong>Duration:</strong>{" "}
                    {calculateNights(dateRange.from, dateRange.to)}{" "}
                    nights
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="room" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select an available room for the selected dates
              </p>

              {availableRooms.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">
                    No rooms available for the selected dates
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className={cn(
                        "border rounded-md p-3 cursor-pointer hover:border-primary transition-colors",
                        selectedRoom === room.roomNumber &&
                          "border-primary bg-primary/5"
                      )}
                      onClick={() => handleRoomSelect(room.roomNumber)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Room {room.roomNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {room.type} • Floor {room.floor}
                          </p>
                        </div>
                        <Badge variant="outline">{room.status}</Badge>
                      </div>
                      <p className="text-sm mt-2">Capacity: {room.capacity}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedRoom && (
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p>
                    <strong>Selected Room:</strong> {selectedRoom}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {
                      mockRooms.find((r) => r.roomNumber === selectedRoom)?.type
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guest" className="mt-4">
            <div className="space-y-4">
              <div className="grid gap-4">
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

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!guestName || !selectedRoom || !dateRange.from || !dateRange.to}>
            Create Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
