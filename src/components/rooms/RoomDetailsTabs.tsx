
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RoomDetailsInfo from "./RoomDetailsInfo";
import RoomReservationsList from "./RoomReservationsList";
import ReservationForm from "./ReservationForm";
import { Room, Reservation } from "@/types";
import { DateRange } from "@/types";

interface RoomDetailsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  room: Room;
  roomReservations: Reservation[];
  onReservationSelect: (reservation: Reservation) => void;
  onNewReservation: () => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  guestName: string;
  setGuestName: (name: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  guestPhone: string;
  setGuestPhone: (phone: string) => void;
  adults: number;
  setAdults: (count: number) => void;
  children: number;
  setChildren: (count: number) => void;
  isEditMode: boolean;
  allReservations: Reservation[];
  selectedReservationId?: string;
}

const RoomDetailsTabs = ({
  activeTab,
  setActiveTab,
  room,
  roomReservations,
  onReservationSelect,
  onNewReservation,
  dateRange,
  setDateRange,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  adults,
  setAdults,
  children,
  setChildren,
  isEditMode,
  allReservations,
  selectedReservationId
}: RoomDetailsTabsProps) => (
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="grid grid-cols-2 w-full">
      <TabsTrigger value="details">Room Details</TabsTrigger>
      <TabsTrigger value="reservation">
        {isEditMode ? "Edit Reservation" : "New Reservation"}
      </TabsTrigger>
    </TabsList>

    <TabsContent value="details" className="space-y-4">
      <RoomDetailsInfo room={room} />
      <RoomReservationsList
        reservations={roomReservations}
        onReservationSelect={onReservationSelect}
        onNewReservation={onNewReservation}
      />
    </TabsContent>

    <TabsContent value="reservation" className="space-y-4">
      <ReservationForm
        dateRange={dateRange}
        setDateRange={setDateRange}
        guestName={guestName}
        setGuestName={setGuestName}
        guestEmail={guestEmail}
        setGuestEmail={setGuestEmail}
        guestPhone={guestPhone}
        setGuestPhone={setGuestPhone}
        adults={adults}
        setAdults={setAdults}
        children={children}
        setChildren={setChildren}
        isEditMode={isEditMode}
        roomNumber={room.roomNumber}
        allReservations={allReservations}
        excludeReservationId={selectedReservationId}
      />
    </TabsContent>
  </Tabs>
);

export default RoomDetailsTabs;
