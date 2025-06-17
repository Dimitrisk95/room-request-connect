
import { AuthUser } from '@/components/auth/types';
import { USER_ROLES } from '@/constants/auth';

export class PermissionChecker {
  static isAdmin(user: AuthUser | null): boolean {
    return user?.role === USER_ROLES.ADMIN;
  }

  static isStaff(user: AuthUser | null): boolean {
    return user?.role === USER_ROLES.STAFF;
  }

  static isGuest(user: AuthUser | null): boolean {
    return user?.role === USER_ROLES.GUEST;
  }

  static canManageRooms(user: AuthUser | null): boolean {
    return this.isAdmin(user) || user?.can_manage_rooms === true;
  }

  static canManageStaff(user: AuthUser | null): boolean {
    return this.isAdmin(user) || user?.can_manage_staff === true;
  }

  static hasAnyRole(user: AuthUser | null, roles: string[]): boolean {
    return user?.role ? roles.includes(user.role) : false;
  }
}
