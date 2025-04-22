
import { v4 as uuidv4 } from 'uuid';

// Define the Request type
export type Request = {
  id: string;
  guestName: string;
  roomNumber: string;
  type: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
};

// Mock requests data
export const mockRequests: Request[] = [
  {
    id: '1',
    guestName: 'John Doe',
    roomNumber: '101',
    type: 'Housekeeping',
    description: 'Need fresh towels',
    status: 'pending',
    createdAt: new Date('2025-04-20T10:00:00'),
    updatedAt: new Date('2025-04-20T10:00:00'),
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    roomNumber: '205',
    type: 'Maintenance',
    description: 'AC not working properly',
    status: 'in-progress',
    createdAt: new Date('2025-04-19T14:30:00'),
    updatedAt: new Date('2025-04-19T15:45:00'),
    assignedTo: 'Mike Technician',
  },
  {
    id: '3',
    guestName: 'Robert Johnson',
    roomNumber: '310',
    type: 'Room Service',
    description: 'Order breakfast for tomorrow morning',
    status: 'completed',
    createdAt: new Date('2025-04-18T20:15:00'),
    updatedAt: new Date('2025-04-19T07:30:00'),
    assignedTo: 'Food Service Team',
  },
];

// Create a new request
export const createRequest = (
  guestName: string, 
  roomNumber: string, 
  type: string, 
  description: string
): Request => {
  const newRequest: Request = {
    id: uuidv4(),
    guestName,
    roomNumber,
    type,
    description,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // In a real app, we would save to database here
  mockRequests.push(newRequest);
  
  return newRequest;
};
