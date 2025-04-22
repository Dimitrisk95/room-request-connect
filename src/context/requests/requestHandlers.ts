
import { Request } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Mock requests data used for the prototype
export const mockRequests: Request[] = [
  {
    id: "req-1",
    title: "Extra towels needed",
    description: "Could I get some extra towels for my room please?",
    roomId: "room-1-1",
    roomNumber: "101",
    guestId: "guest-1",
    guestName: "John Doe",
    category: "housekeeping",
    status: "pending",
    priority: "medium",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-2",
    title: "TV not working",
    description: "The TV in my room isn't turning on. Could someone help?",
    roomId: "room-1-2",
    roomNumber: "102",
    guestId: "guest-2",
    guestName: "Jane Smith",
    category: "maintenance",
    status: "in-progress",
    priority: "high",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    assignedTo: "staff-1",
    assignedToName: "Staff Member",
  },
  {
    id: "req-3",
    title: "Room service breakfast",
    description: "I'd like to order breakfast for tomorrow morning at 8am.",
    roomId: "room-2-1",
    roomNumber: "201",
    guestId: "guest-3",
    guestName: "Robert Johnson",
    category: "room-service",
    status: "resolved",
    priority: "medium",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    assignedTo: "staff-1",
    assignedToName: "Staff Member",
    resolvedBy: "staff-1",
    resolvedByName: "Staff Member",
    resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-4",
    title: "Noisy neighbors",
    description: "The room next door is very loud. Can you please address this?",
    roomId: "room-2-5",
    roomNumber: "205",
    guestId: "guest-4",
    guestName: "Sarah Williams",
    category: "complaint",
    status: "pending",
    priority: "urgent",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "req-5",
    title: "WiFi connection issues",
    description: "I'm having trouble connecting to the hotel WiFi.",
    roomId: "room-3-2",
    roomNumber: "302",
    guestId: "guest-5",
    guestName: "Michael Brown",
    category: "maintenance",
    status: "cancelled",
    priority: "medium",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
  }
];

// Function to create a new request
export const createRequest = (requestData: {
  title: string;
  description: string;
  roomNumber: string;
  guestId: string;
  guestName: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
}) => {
  const now = new Date().toISOString();
  const newRequest: Request = {
    id: `req-${uuidv4()}`,
    title: requestData.title,
    description: requestData.description,
    roomId: `room-for-${requestData.roomNumber}`, // This would come from a real room lookup
    roomNumber: requestData.roomNumber,
    guestId: requestData.guestId,
    guestName: requestData.guestName,
    category: requestData.category as any, // Cast to proper type from Request
    status: "pending",
    priority: requestData.priority,
    createdAt: now,
    updatedAt: now,
  };

  // In a real implementation, save to database
  // For now, add to mock data
  mockRequests.unshift(newRequest);
  
  return newRequest;
};

// Future implementation: Fetch requests from the database
// export const fetchRequests = async () => {
//   const { data, error } = await supabase
//     .from('requests')
//     .select('*')
//     .order('createdAt', { ascending: false });
//
//   if (error) throw error;
//   return data;
// };
