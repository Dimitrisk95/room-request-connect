
/**
 * Utility functions for generating and managing hotel and room codes
 */

/**
 * Generates a random alphanumeric code of specified length
 */
export const generateRandomCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'; // Removed similar looking characters like 0, O, I, 1
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

/**
 * Generates a hotel code based on the hotel name
 * Format: First 3 letters of hotel name + 3 random characters
 */
export const generateHotelCode = (hotelName: string): string => {
  const prefix = hotelName
    .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
    .substring(0, 3) // Take first 3 letters
    .toUpperCase();
  
  const randomPart = generateRandomCode(3);
  return `${prefix}${randomPart}`;
};

/**
 * Generates a room code for a specific room
 * Format: 2 hotel code characters + room number + 2 random characters
 */
export const generateRoomCode = (hotelCode: string, roomNumber: string): string => {
  const prefix = hotelCode.substring(0, 2);
  const sanitizedRoomNumber = roomNumber.replace(/[^a-zA-Z0-9]/g, '');
  const roomPart = sanitizedRoomNumber.substring(0, 3).padStart(3, '0');
  const randomPart = generateRandomCode(2);
  
  return `${prefix}${roomPart}${randomPart}`;
};
