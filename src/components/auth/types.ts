
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: 'admin' | 'staff' | 'guest'
  hotelId?: string
  roomNumber?: string
  can_manage_rooms?: boolean
  can_manage_staff?: boolean
}

export interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  guestSignIn: (hotelCode: string, roomCode: string) => Promise<void>
}
