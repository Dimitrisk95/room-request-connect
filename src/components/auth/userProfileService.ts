
import { supabase } from '@/integrations/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { AuthUser } from './types'
import { logger } from '@/utils/logger'

export const createFallbackUser = (supabaseUser: SupabaseUser): AuthUser => {
  // Check for pending hotel ID and include it in the fallback user
  const pendingHotelId = localStorage.getItem("pendingHotelId");
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    role: 'admin', // Default to admin for fallback
    hotelId: pendingHotelId || undefined // Include pending hotel ID if available
  }
}

export const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<AuthUser> => {
  logger.info('Loading user profile', { userId: supabaseUser.id })
  
  // Create fallback user first
  const fallbackUser = createFallbackUser(supabaseUser)
  
  try {
    // Try to fetch user profile with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    })
    
    const fetchPromise = supabase
      .from('users')
      .select('*')
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
        hotelId: userData.hotel_id || fallbackUser.hotelId, // Use pending hotel ID if no hotel_id in database
        roomNumber: userData.room_number,
        can_manage_rooms: userData.can_manage_rooms,
        can_manage_staff: userData.can_manage_staff
      }
      
      // If we have a pending hotel ID and it's different from what's in the database, clear it
      const pendingHotelId = localStorage.getItem("pendingHotelId");
      if (pendingHotelId && userData.hotel_id === pendingHotelId) {
        localStorage.removeItem("pendingHotelId");
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
