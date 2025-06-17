
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  ROOMS: '/rooms',
  STAFF_MANAGEMENT: '/staff-management',
  CALENDAR: '/calendar',
  REQUESTS: '/requests',
  SETTINGS: '/settings',
  ANALYTICS: '/analytics',
  ACCESS_CODES: '/access-codes',
  GUEST_ROOM: (roomCode: string) => `/guest/${roomCode}`,
} as const;
