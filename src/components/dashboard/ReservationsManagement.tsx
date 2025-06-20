
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Search, User, Bed, Plus, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  guest_name: string;
  guest_email: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  guests_count: number;
  special_requests?: string;
  created_at: string;
}

interface Room {
  id: string;
  room_number: string;
  type: string;
  status: string;
}

const ReservationsManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewReservationDialog, setShowNewReservationDialog] = useState(false);
  const [newReservation, setNewReservation] = useState({
    guest_name: '',
    guest_email: '',
    room_number: '',
    check_in_date: '',
    check_out_date: '',
    guests_count: 1,
    special_requests: ''
  });

  useEffect(() => {
    fetchData();
  }, [user?.hotelId]);

  const fetchData = async () => {
    if (!user?.hotelId) return;

    try {
      // Fetch rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', user.hotelId);

      setRooms(roomsData || []);

      // Note: We're using mock data for reservations since there's no reservations table yet
      // In a real implementation, you would fetch from a reservations table
      const mockReservations: Reservation[] = [
        {
          id: '1',
          guest_name: 'John Smith',
          guest_email: 'john.smith@email.com',
          room_number: '101',
          check_in_date: '2024-06-25',
          check_out_date: '2024-06-28',
          status: 'confirmed',
          guests_count: 2,
          special_requests: 'Late check-in requested',
          created_at: '2024-06-20T10:00:00Z'
        },
        {
          id: '2',
          guest_name: 'Sarah Johnson',
          guest_email: 'sarah.j@email.com',
          room_number: '205',
          check_in_date: '2024-06-22',
          check_out_date: '2024-06-25',
          status: 'checked_in',
          guests_count: 1,
          created_at: '2024-06-18T14:30:00Z'
        }
      ];

      setReservations(mockReservations);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async () => {
    if (!newReservation.guest_name || !newReservation.guest_email || !newReservation.room_number || 
        !newReservation.check_in_date || !newReservation.check_out_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, you would insert into a reservations table
      const newReservationData: Reservation = {
        id: Math.random().toString(36).substr(2, 9),
        ...newReservation,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };

      setReservations(prev => [newReservationData, ...prev]);

      toast({
        title: "Success",
        description: "Reservation created successfully",
      });

      setNewReservation({
        guest_name: '',
        guest_email: '',
        room_number: '',
        check_in_date: '',
        check_out_date: '',
        guests_count: 1,
        special_requests: ''
      });
      setShowNewReservationDialog(false);
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create reservation",
        variant: "destructive"
      });
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: newStatus as any }
            : res
        )
      );

      toast({
        title: "Success",
        description: "Reservation status updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update reservation status",
        variant: "destructive"
      });
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.status === 'vacant');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage bookings and check-ins</p>
        </div>
        <Dialog open={showNewReservationDialog} onOpenChange={setShowNewReservationDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Reservation</DialogTitle>
              <DialogDescription>
                Add a new reservation for a guest.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="guest_name">Guest Name</Label>
                <Input
                  id="guest_name"
                  value={newReservation.guest_name}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, guest_name: e.target.value }))}
                  placeholder="Enter guest name"
                />
              </div>
              <div>
                <Label htmlFor="guest_email">Guest Email</Label>
                <Input
                  id="guest_email"
                  type="email"
                  value={newReservation.guest_email}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, guest_email: e.target.value }))}
                  placeholder="Enter guest email"
                />
              </div>
              <div>
                <Label htmlFor="room_number">Room</Label>
                <Select
                  value={newReservation.room_number}
                  onValueChange={(value) => setNewReservation(prev => ({ ...prev, room_number: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRooms().map((room) => (
                      <SelectItem key={room.id} value={room.room_number}>
                        Room {room.room_number} ({room.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check_in_date">Check-in Date</Label>
                  <Input
                    id="check_in_date"
                    type="date"
                    value={newReservation.check_in_date}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, check_in_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="check_out_date">Check-out Date</Label>
                  <Input
                    id="check_out_date"
                    type="date"
                    value={newReservation.check_out_date}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, check_out_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="guests_count">Number of Guests</Label>
                <Input
                  id="guests_count"
                  type="number"
                  min="1"
                  value={newReservation.guests_count}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, guests_count: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label htmlFor="special_requests">Special Requests</Label>
                <Input
                  id="special_requests"
                  value={newReservation.special_requests}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, special_requests: e.target.value }))}
                  placeholder="Any special requests (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewReservationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createReservation}>
                Create Reservation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold">{reservations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{reservations.filter(r => r.status === 'confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-2xl font-bold">{reservations.filter(r => r.status === 'checked_in').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Bed className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Rooms</p>
                <p className="text-2xl font-bold">{getAvailableRooms().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters or search terms."
                    : "Start by creating your first reservation."
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button onClick={() => setShowNewReservationDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Reservation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{reservation.guest_name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {reservation.guest_email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Bed className="h-4 w-4 mr-1" />
                        Room {reservation.room_number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reservation.guests_count} guest{reservation.guests_count > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Check-in</p>
                      <p className="font-medium">{new Date(reservation.check_in_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Check-out</p>
                      <p className="font-medium">{new Date(reservation.check_out_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {reservation.special_requests && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                      <p className="text-gray-900">{reservation.special_requests}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {reservation.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateReservationStatus(reservation.id, 'checked_in')}
                      >
                        Check In
                      </Button>
                    )}
                    {reservation.status === 'checked_in' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateReservationStatus(reservation.id, 'checked_out')}
                      >
                        Check Out
                      </Button>
                    )}
                    {(reservation.status === 'confirmed' || reservation.status === 'checked_in') && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationsManagement;
