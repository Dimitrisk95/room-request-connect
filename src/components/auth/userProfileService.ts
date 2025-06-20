
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/utils/logger'
import { AuthUser } from './types'

export const loadUserProfile = async (supabaseUser: User): Promise<AuthUser> => {
  try {
    logger.info('Loading user profile', { userId: supabaseUser.id })
    
    // Much shorter timeout for profile loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 1500)
    )
    
    const profilePromise = supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()
    
    const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any
    
    if (error) {
      logger.error('Failed to load user profile', error)
      throw error
    }
    
    if (!profile) {
      logger.error('No profile found for user')
      throw new Error('No profile found')
    }
    
    const authUser: AuthUser = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      hotelId: profile.hotel_id,
      roomNumber: profile.room_number,
      can_manage_rooms: profile.can_manage_rooms || false,
      can_manage_staff: profile.can_manage_staff || false
    }
    
    logger.info('Profile loaded successfully', authUser)
    return authUser
  } catch (error) {
    logger.error('Failed to load user profile', error)
    throw error
  }
}

export const createFallbackUser = (supabaseUser: User): AuthUser => {
  const fallbackUser: AuthUser = {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email || 'User',
    role: 'admin', // Default to admin for fallback to ensure access
    hotelId: undefined,
    roomNumber: undefined,
    can_manage_rooms: true,
    can_manage_staff: true
  }
  
  logger.info('Created fallback user', fallbackUser)
  return fallbackUser
}

export const refreshUserProfile = async (userId: string): Promise<AuthUser | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error || !profile) {
      logger.error('Failed to refresh user profile', error)
      return null
    }
    
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      hotelId: profile.hotel_id,
      roomNumber: profile.room_number,
      can_manage_rooms: profile.can_manage_rooms || false,
      can_manage_staff: profile.can_manage_staff || false
    }
  } catch (error) {
    logger.error('Error refreshing user profile', error)
    return null
  }
}
