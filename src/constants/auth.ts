
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  STAFF: 'staff' as const,
  GUEST: 'guest' as const,
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  GUEST_ROOM: '/guest',
} as const;

export const PERMISSIONS = {
  CAN_MANAGE_ROOMS: 'can_manage_rooms',
  CAN_MANAGE_STAFF: 'can_manage_staff',
} as const;
