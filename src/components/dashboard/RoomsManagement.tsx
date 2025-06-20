
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Search, Bed, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const roomSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  floor: z.string().optional(),
  type: z.string().optional(),
  bed_type: z.string().optional(),
  capacity: z.string().optional(),
  status: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface Room {
  id: string;
  room_number: string;
  floor: number | null;
  type: string | null;
  bed_type: string | null;
  capacity: number | null;
  status: string;
  room_code: string | null;
}

const RoomsManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      floor: "",
      type: "",
      bed_type: "",
      capacity: "",
      status: "vacant",
    },
  });

  const fetchRooms = async () => {
    if (!user?.hotelId) return;

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', user.hotelId)
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user?.hotelId]);

  const onSubmit = async (values: RoomFormValues) => {
    if (!user?.hotelId) return;

    try {
      const roomData = {
        hotel_id: user.hotelId,
        room_number: values.room_number,
        floor: values.floor ? parseInt(values.floor) : null,
        type: values.type || null,
        bed_type: values.bed_type || null,
        capacity: values.capacity ? parseInt(values.capacity) : null,
        status: values.status || 'vacant',
      };

      const { error } = await supabase
        .from('rooms')
        .insert([roomData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room created successfully",
      });

      setShowAddDialog(false);
      form.reset();
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vacant':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.type && room.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFloor = floorFilter === "all" || room.floor?.toString() === floorFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;

    return matchesSearch && matchesFloor && matchesType && matchesStatus;
  });

  const floors = [...new Set(rooms.map(room => room.floor).filter(Boolean))].sort();
  const types = [...new Set(rooms.map(room => room.type).filter(Boolean))];
  const statuses = ['vacant', 'occupied', 'maintenance', 'cleaning'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-gray-600">Manage your hotel rooms and their details</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Create a new room for your hotel
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="room_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor</FormLabel>
                      <FormControl>
                        <Input placeholder="1" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="penthouse">Penthouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bed_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bed Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bed type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                          <SelectItem value="queen">Queen</SelectItem>
                          <SelectItem value="king">King</SelectItem>
                          <SelectItem value="twin">Twin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occupancy</FormLabel>
                      <FormControl>
                        <Input placeholder="2" type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vacant">Vacant</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Create Room</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Floors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {floors.map(floor => (
                  <SelectItem key={floor} value={floor.toString()}>
                    Floor {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFloorFilter("all");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-gray-500 mr-2" />
                  <CardTitle className="text-lg">Room {room.room_number}</CardTitle>
                </div>
                <Badge className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {room.floor && (
                <p className="text-sm text-gray-600">Floor: {room.floor}</p>
              )}
              {room.type && (
                <p className="text-sm text-gray-600">Type: {room.type}</p>
              )}
              {room.bed_type && (
                <p className="text-sm text-gray-600">Bed: {room.bed_type}</p>
              )}
              {room.capacity && (
                <p className="text-sm text-gray-600">Capacity: {room.capacity} guests</p>
              )}
              {room.room_code && (
                <p className="text-sm text-gray-600">Code: {room.room_code}</p>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-4">
              {rooms.length === 0 
                ? "Get started by adding your first room" 
                : "Try adjusting your filters to see more rooms"
              }
            </p>
            {rooms.length === 0 && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Room
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomsManagement;
