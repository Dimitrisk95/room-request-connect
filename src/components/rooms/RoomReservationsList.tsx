
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/types";

interface RoomReservationsListProps {
  reservations: Reservation[];
  onReservationSelect: (reservation: Reservation) => void;
  onNewReservation: () => void;
}

const RoomReservationsList = ({
  reservations,
  onReservationSelect,
  onNewReservation
}: RoomReservationsListProps) => (
  <div className="mt-6">
    <h3 className="text-md font-medium mb-3">Reservations ({reservations.length})</h3>
    {reservations.length > 0 ? (
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className="border rounded-md p-3 cursor-pointer hover:border-primary"
            onClick={() => onReservationSelect(reservation)}
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
    <Button className="mt-4 w-full" onClick={onNewReservation}>
      Create New Reservation
    </Button>
  </div>
);

export default RoomReservationsList;
