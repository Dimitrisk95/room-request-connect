
import { supabase } from '@/integrations/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { AuthUser } from './types'
import { logger } from '@/utils/logger'

export const createFallbackUser = (supabaseUser: SupabaseUser): AuthUser => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    role: 'admin', // Default to admin for fallback
    hotelId: undefined
  }
}

export const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<AuthUser> => {
  logger.info('Loading user profile', { userId: supabaseUser.id })
  
  // Create fallback user first
  const fallbackUser = createFallbackUser(supabaseUser)
  
  try {
    // Reduced timeout to 3 seconds and simplified query
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
    })
    
    const fetchPromise = supabase
      .from('users')
      .select('id, name, email, role, hotel_id, room_number, can_manage_rooms, can_manage_staff')
      .eq('id', supabaseUser.id)
      .maybeSingle()
    
    const { data: userData, error } = await Promise.race([fetchPromise, timeoutPromise])

    if (error) {
      logger.error('Error loading user profile, using fallback', error)
      return fallbackUser
    }

    if (userData) {
      const authUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        hotelId: userData.hotel_id,
        roomNumber: userData.room_number,
        can_manage_rooms: userData.can_manage_rooms,
        can_manage_staff: userData.can_manage_staff
      }
      
      logger.info('User profile loaded successfully', authUser)
      return authUser
    } else {
      logger.info('No user profile found, using fallback')
      return fallbackUser
    }
  } catch (error) {
    logger.error('Failed to load user profile, using fallback', error)
    return fallbackUser
  }
}

// New function to refresh user profile after hotel creation
export const refreshUserProfile = async (userId: string): Promise<AuthUser | null> => {
  try {
    logger.info('Refreshing user profile after hotel creation', { userId })
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, name, email, role, hotel_id, room_number, can_manage_rooms, can_manage_staff')
      .eq('id', userId)
      .single()

    if (error) {
      logger.error('Error refreshing user profile', error)
      return null
    }

    if (userData) {
      const authUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        hotelId: userData.hotel_id,
        roomNumber: userData.room_number,
        can_manage_rooms: userData.can_manage_rooms,
        can_manage_staff: userData.can_manage_staff
      }
      
      logger.info('User profile refreshed successfully', authUser)
      return authUser
    }
  } catch (error) {
    logger.error('Failed to refresh user profile', error)
  }
  
  return null
}
