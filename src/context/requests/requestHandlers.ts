
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
  
  const { data, error } = await supabase.from('requests').insert([{
    id: newRequest.id,
    guest_name: newRequest.guestName,
    room_number: newRequest.roomNumber,
    title: newRequest.title,
    description: newRequest.description,
    category: newRequest.category,
    priority: newRequest.priority,
    status: newRequest.status,
    hotel_id: newRequest.hotelId,
    created_at: newRequest.createdAt,
    updated_at: newRequest.updatedAt
  }]).select().single();

  if (error) {
    console.error("Error creating request:", error);
    throw error;
  }

  return newRequest;
};

// Update request status
export const updateRequestStatus = async (
  requestId: string, 
  newStatus: RequestStatus,
  userId?: string,
  userName?: string
): Promise<Request> => {
  const updates: any = {
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  // Handle assignment when status changes to in-progress
  if (newStatus === 'in-progress' && userId && userName) {
    updates.assigned_to = userId;
    updates.assigned_to_name = userName;
  }

  // Handle resolution
  if (newStatus === 'resolved' && userId && userName) {
    updates.resolved_by = userId;
    updates.resolved_by_name = userName;
    updates.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('requests')
    .update(updates)
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error("Error updating request status:", error);
    throw error;
  }

  return {
    id: data.id,
    guestName: data.guest_name,
    roomNumber: data.room_number,
    title: data.title,
    description: data.description,
    category: data.category as RequestCategory,
    priority: data.priority as RequestPriority,
    status: data.status as RequestStatus,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    assignedTo: data.assigned_to,
    assignedToName: data.assigned_to_name,
    resolvedBy: data.resolved_by,
    resolvedByName: data.resolved_by_name,
    resolvedAt: data.resolved_at,
    notes: data.notes,
    hotelId: data.hotel_id
  };
};

// Add note to request
export const addRequestNote = async (requestId: string, note: string): Promise<void> => {
  // First get the current notes
  const { data: currentRequest, error: fetchError } = await supabase
    .from('requests')
    .select('notes')
    .eq('id', requestId)
    .single();

  if (fetchError) {
    console.error("Error fetching current notes:", fetchError);
    throw fetchError;
  }

  const currentNotes = currentRequest.notes || [];
  const updatedNotes = [...currentNotes, note];

  const { error } = await supabase
    .from('requests')
    .update({ 
      notes: updatedNotes,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId);

  if (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// Fetch requests
export const fetchRequests = async (hotelId: string): Promise<Request[]> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(req => ({
      id: req.id,
      guestName: req.guest_name,
      roomNumber: req.room_number,
      title: req.title,
      description: req.description,
      category: req.category as RequestCategory,
      priority: req.priority as RequestPriority,
      status: req.status as RequestStatus,
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
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
};

// Fetch requests by status
export const fetchRequestsByStatus = async (hotelId: string, status: RequestStatus): Promise<Request[]> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(req => ({
      id: req.id,
      guestName: req.guest_name,
      roomNumber: req.room_number,
      title: req.title,
      description: req.description,
      category: req.category as RequestCategory,
      priority: req.priority as RequestPriority,
      status: req.status as RequestStatus,
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
  } catch (error) {
    console.error("Error fetching requests by status:", error);
    return [];
  }
};

// Fetch requests assigned to user
export const fetchAssignedRequests = async (hotelId: string, userId: string): Promise<Request[]> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('assigned_to', userId)
      .in('status', ['pending', 'in-progress'])
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(req => ({
      id: req.id,
      guestName: req.guest_name,
      roomNumber: req.room_number,
      title: req.title,
      description: req.description,
      category: req.category as RequestCategory,
      priority: req.priority as RequestPriority,
      status: req.status as RequestStatus,
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
  } catch (error) {
    console.error("Error fetching assigned requests:", error);
    return [];
  }
};
