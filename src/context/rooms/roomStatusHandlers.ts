
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/types';

export type RoomStatus = "vacant" | "occupied" | "maintenance" | "cleaning";

// Update room status
export const updateRoomStatus = async (
  roomId: string,
  newStatus: RoomStatus,
  userId?: string,
  notes?: string
): Promise<Room> => {
  const updates: any = {
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', roomId)
    .select()
    .single();

  if (error) {
    console.error("Error updating room status:", error);
    throw error;
  }

  // Log the status change
  if (userId) {
    await logRoomStatusChange(roomId, newStatus, userId, notes);
  }

  return {
    id: data.id,
    roomNumber: data.room_number,
    floor: data.floor,
    type: data.type,
    bedType: data.bed_type as "single" | "double" | "queen" | "king" | "twin" | "suite",
    status: data.status as RoomStatus,
    capacity: data.capacity,
    room_code: data.room_code,
  };
};

// Log room status changes for audit trail
export const logRoomStatusChange = async (
  roomId: string,
  newStatus: RoomStatus,
  userId: string,
  notes?: string
): Promise<void> => {
  const logEntry = {
    room_id: roomId,
    status: newStatus,
    changed_by: userId,
    notes: notes || null,
    changed_at: new Date().toISOString()
  };

  console.log('Room status change logged:', logEntry);
  // In a real app, you'd save this to a room_status_log table
};

// Bulk update room statuses
export const bulkUpdateRoomStatus = async (
  roomIds: string[],
  newStatus: RoomStatus,
  userId?: string
): Promise<Room[]> => {
  const updates = {
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .in('id', roomIds)
    .select();

  if (error) {
    console.error("Error bulk updating room statuses:", error);
    throw error;
  }

  // Log bulk changes
  if (userId) {
    for (const roomId of roomIds) {
      await logRoomStatusChange(roomId, newStatus, userId, `Bulk status update`);
    }
  }

  return data.map(room => ({
    id: room.id,
    roomNumber: room.room_number,
    floor: room.floor,
    type: room.type,
    bedType: room.bed_type as "single" | "double" | "queen" | "king" | "twin" | "suite",
    status: room.status as RoomStatus,
    capacity: room.capacity,
    room_code: room.room_code,
  }));
};

// Get rooms by status
export const getRoomsByStatus = async (
  hotelId: string,
  status: RoomStatus
): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('hotel_id', hotelId)
    .eq('status', status);

  if (error) {
    console.error("Error fetching rooms by status:", error);
    throw error;
  }

  return data.map(room => ({
    id: room.id,
    roomNumber: room.room_number,
    floor: room.floor,
    type: room.type,
    bedType: room.bed_type as "single" | "double" | "queen" | "king" | "twin" | "suite",
    status: room.status as RoomStatus,
    capacity: room.capacity,
    room_code: room.room_code,
  }));
};

// Get room status summary
export const getRoomStatusSummary = async (hotelId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('status')
    .eq('hotel_id', hotelId);

  if (error) {
    console.error("Error fetching room status summary:", error);
    throw error;
  }

  const summary = {
    total: data.length,
    vacant: data.filter(r => r.status === 'vacant').length,
    occupied: data.filter(r => r.status === 'occupied').length,
    maintenance: data.filter(r => r.status === 'maintenance').length,
    cleaning: data.filter(r => r.status === 'cleaning').length,
  };

  return summary;
};
