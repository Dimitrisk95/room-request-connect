
import { Button } from "@/components/ui/button";
import { Reservation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";

interface Props {
  reservations: Reservation[];
  onDeleteReservation: (reservationId: string) => void;
}

const CalendarListReservations = ({ reservations, onDeleteReservation }: Props) => (
  <div className="space-y-4">
    {reservations.map((reservation) => (
      <div key={reservation.id} className="flex items-center border rounded-lg p-4">
        <div className="font-medium text-lg mr-3">
          Room {reservation.roomNumber}
        </div>
        <div className="flex-1">
          <div className="font-medium">{reservation.guestName}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
          </div>
          <div className="text-sm mt-1">
            {reservation.adults + reservation.children} Guests
          </div>
        </div>
        <div className="hidden md:block text-right mr-4">
          <div className="font-medium">${reservation.totalAmount}</div>
          <div className="text-sm text-muted-foreground">
            <Badge variant={reservation.status === "confirmed" ? "outline" : "default"}>
              {reservation.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/rooms`}>View Rooms</Link>
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDeleteReservation(reservation.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export default CalendarListReservations;
