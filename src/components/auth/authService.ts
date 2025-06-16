
import { supabase } from '@/integrations/supabase/client'
import { AuthUser } from './types'
import { logger } from '@/utils/logger'

export const signIn = async (email: string, password: string) => {
  try {
    logger.info('Attempting sign in', { email })
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      logger.error('Sign in failed', error)
      return { error }
    }
    
    logger.info('Sign in successful')
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export const signUp = async (email: string, password: string, name: string) => {
  try {
    logger.info('Attempting sign up', { email, name })
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name, role: 'admin' }
      }
    })
    
    if (error) {
      logger.error('Sign up failed', error)
      return { error }
    }
    
    logger.info('Sign up successful')
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export const signOut = async () => {
  try {
    logger.info('Attempting sign out')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      logger.error('Sign out failed', error)
      throw error
    }
    
    logger.info('Sign out successful')
  } catch (error) {
    logger.error('Sign out error', error)
    throw error
  }
}

export const guestSignIn = async (hotelCode: string, roomCode: string): Promise<AuthUser> => {
  try {
    logger.info('Guest sign in attempt', { hotelCode, roomCode })
    
    const guestUser: AuthUser = {
      id: `guest-${Date.now()}`,
      email: `guest-${hotelCode}-${roomCode}@temp.com`,
      name: 'Guest User',
      role: 'guest',
      hotelId: hotelCode,
      roomNumber: roomCode
    }
    
    logger.info('Guest sign in successful', guestUser)
    return guestUser
  } catch (error) {
    logger.error('Guest sign in error', error)
    throw error
  }
}
