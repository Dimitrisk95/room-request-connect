
import { v4 as uuidv4 } from 'uuid';
import { RequestCategory, RequestPriority, RequestStatus } from '@/types';

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
};

// Mock requests data
export const mockRequests: Request[] = [
  {
    id: '1',
    guestName: 'John Doe',
    roomNumber: '101',
    title: 'Need fresh towels',
    description: 'Could I get some fresh towels delivered to my room?',
    category: 'housekeeping',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2025-04-20T10:00:00').toISOString(),
    updatedAt: new Date('2025-04-20T10:00:00').toISOString(),
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    roomNumber: '205',
    title: 'AC not working properly',
    description: 'The air conditioning is making strange noises and not cooling the room effectively.',
    category: 'maintenance',
    priority: 'high',
    status: 'in-progress',
    createdAt: new Date('2025-04-19T14:30:00').toISOString(),
    updatedAt: new Date('2025-04-19T15:45:00').toISOString(),
    assignedTo: 'staff-1',
    assignedToName: 'Mike Technician',
  },
  {
    id: '3',
    guestName: 'Robert Johnson',
    roomNumber: '310',
    title: 'Order breakfast for tomorrow',
    description: 'I would like to order breakfast for tomorrow morning at 7:30 AM.',
    category: 'room-service',
    priority: 'low',
    status: 'completed',
    createdAt: new Date('2025-04-18T20:15:00').toISOString(),
    updatedAt: new Date('2025-04-19T07:30:00').toISOString(),
    assignedTo: 'staff-2',
    assignedToName: 'Food Service Team',
    resolvedBy: 'staff-2',
    resolvedByName: 'Food Service Team',
    resolvedAt: new Date('2025-04-19T07:30:00').toISOString(),
  },
];

// Create a new request
export const createRequest = (requestData: {
  guestName: string;
  roomNumber: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  guestId?: string;
}): Request => {
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
  };
  
  // In a real app, we would save to database here
  mockRequests.push(newRequest);
  
  return newRequest;
};
