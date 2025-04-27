
import { v4 as uuidv4 } from 'uuid';
import { RequestCategory, RequestPriority, RequestStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Define the Request type
export type Request = {
  id: string;
  guestName: string;
  roomNumber: string;
  title: string;
  description: string;
  type?: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  resolvedAt?: string;
  notes?: string[];
  hotelId?: string;
};

// Create a new request
export const createRequest = async (requestData: {
  guestName: string;
  roomNumber: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  hotelId: string;
}): Promise<Request> => {
  const newRequest: Request = {
    id: uuidv4(),
    guestName: requestData.guestName,
    roomNumber: requestData.roomNumber,
    title: requestData.title,
    description: requestData.description,
    category: requestData.category,
    priority: requestData.priority,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: requestData.hotelId
  };
  
  const { data, error } = await supabase
    .from('requests')
    .insert([{
      ...newRequest,
      hotel_id: requestData.hotelId,
      room_number: requestData.roomNumber
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return newRequest;
};

// Fetch requests
export const fetchRequests = async (hotelId: string): Promise<Request[]> => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('hotel_id', hotelId);

  if (error) {
    throw error;
  }

  return (data || []).map(req => ({
    id: req.id,
    guestName: req.guest_name,
    roomNumber: req.room_number,
    title: req.title,
    description: req.description,
    category: req.category,
    priority: req.priority,
    status: req.status,
    createdAt: req.created_at,
    updatedAt: req.updated_at,
    assignedTo: req.assigned_to,
    assignedToName: req.assigned_to_name,
    resolvedBy: req.resolved_by,
    resolvedByName: req.resolved_by_name,
    resolvedAt: req.resolved_at,
    notes: req.notes,
    hotelId: req.hotel_id
  }));
};
