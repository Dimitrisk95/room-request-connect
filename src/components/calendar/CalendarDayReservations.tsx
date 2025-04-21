
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reservation, Room } from "@/types";
import { Trash } from "lucide-react";

interface Props {
  roomReservations: Record<string, Reservation[]>;
  getRoomData: (roomNumber: string) => Room | undefined;
  formattedDate: string;
  onDeleteReservation: (reservationId: string) => void;
}

const CalendarDayReservations = ({ roomReservations, getRoomData, formattedDate, onDeleteReservation }: Props) => (
  <div className="space-y-6">
    {Object.entries(roomReservations).map(([roomNumber, reservations]) => {
      const room = getRoomData(roomNumber);
      return (
        <div key={roomNumber} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Room {roomNumber}</h3>
              <p className="text-sm text-muted-foreground">{room?.type || "Standard"} Room</p>
            </div>
            <Badge variant={room?.status === "occupied" ? "default" : "outline"}>
              {room?.status || "vacant"}
            </Badge>
          </div>
          {reservations.map((reservation) => {
            const isCheckIn = reservation.checkIn === formattedDate;
            const isCheckOut = reservation.checkOut === formattedDate;
            return (
              <div key={reservation.id} className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{reservation.guestName}</h4>
                    <p className="text-sm">
                      {reservation.adults + reservation.children} Guests • ${reservation.totalAmount}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {isCheckIn && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Check-in today
                        </Badge>
                      )}
                      {isCheckOut && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Check-out today
                        </Badge>
                      )}
                      {!isCheckIn && !isCheckOut && (
                        <Badge variant="outline">
                          Staying
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDeleteReservation(reservation.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Cancel Reservation
                  </Button>
                  {isCheckIn && <Button size="sm">Check In</Button>}
                  {isCheckOut && <Button size="sm">Check Out</Button>}
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);

export default CalendarDayReservations;
