
import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Session } from '@supabase/supabase-js'
import { logger } from '@/utils/logger'
import { AuthContext } from './AuthContext'
import { AuthUser, AuthContextType } from './types'
import { loadUserProfile, createFallbackUser, refreshUserProfile } from './userProfileService'
import { signIn, signUp, signOut, guestSignIn } from './authService'

interface AuthProviderProps {
  children: React.ReactNode
}

const generateRandomHotelName = () => {
  const prefixes = ['Hotel', 'Resort', 'Inn', 'Lodge', 'Suites'];
  const suffixes = ['Plaza', 'Palace', 'Grand', 'Royal', 'Elite', 'Premium'];
  const randomNum = Math.floor(Math.random() * 10000);
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix} ${suffix} ${randomNum}`;
};

const createDefaultHotel = async (userId: string) => {
  try {
    const hotelName = generateRandomHotelName();
    const hotelCode = `HTL${Math.floor(Math.random() * 10000)}`;
    
    const { data: hotel, error } = await supabase
      .from('hotels')
      .insert({
        name: hotelName,
        code: hotelCode,
        address: 'Address to be configured',
        contact_email: 'Contact email to be configured',
        contact_phone: 'Phone to be configured'
      })
      .select()
      .single();

    if (error) throw error;

    // Associate user with the hotel
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ hotel_id: hotel.id })
      .eq('id', userId);

    if (userUpdateError) throw userUpdateError;

    return hotel;
  } catch (error) {
    logger.error('Failed to create default hotel', error);
    throw error;
  }
};

export const SimpleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const updateUserState = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      try {
        let authUser = await loadUserProfile(currentSession.user)
        
        // Only create hotel for admin users who don't have one AND we successfully loaded their profile
        if (authUser.role === 'admin' && !authUser.hotelId && authUser.id === currentSession.user.id) {
          logger.info('Admin without hotel detected, creating default hotel');
          try {
            const hotel = await createDefaultHotel(authUser.id);
            authUser.hotelId = hotel.id;
            logger.info('Default hotel created for admin', { hotelId: hotel.id, hotelName: hotel.name });
          } catch (hotelError) {
            logger.error('Failed to create hotel, continuing with auth anyway', hotelError);
            // Continue with auth even if hotel creation fails
          }
        }
        
        setUser(authUser)
        logger.info('User profile set', authUser)
      } catch (error) {
        logger.error('Profile loading failed', error)
        const fallbackUser = createFallbackUser(currentSession.user)
        setUser(fallbackUser)
        logger.info('Using fallback user', fallbackUser)
      }
    } else {
      setUser(null)
    }
    setIsLoading(false) // Always stop loading after processing
  }

  // Function to refresh user profile (can be called after hotel creation)
  const refreshUser = async () => {
    if (session?.user) {
      try {
        const refreshedUser = await refreshUserProfile(session.user.id)
        if (refreshedUser) {
          setUser(refreshedUser)
          logger.info('User profile refreshed', refreshedUser)
        }
      } catch (error) {
        logger.error('Failed to refresh user profile', error)
      }
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth...')
        
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          logger.error('Error getting session', error)
        } else if (currentSession?.user && mounted) {
          logger.info('Found existing session')
          setSession(currentSession)
          await updateUserState(currentSession)
        } else {
          // No session found, stop loading
          if (mounted) {
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Session initialization error', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      logger.info('Auth state changed', { event, hasSession: !!session })
      
      if (event === 'SIGNED_IN' && session?.user) {
        setSession(session)
        await updateUserState(session)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setIsLoading(false)
      }
    })

    // Initialize auth
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleGuestSignIn = async (hotelCode: string, roomCode: string) => {
    const guestUser = await guestSignIn(hotelCode, roomCode)
    setUser(guestUser)
    setIsLoading(false)
  }

  const handleSignUp = async (email: string, password: string, name: string) => {
    return await signUp(email, password, name)
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp: handleSignUp,
    signOut,
    guestSignIn: handleGuestSignIn,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth } from './useAuth'
