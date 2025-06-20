
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
    try {
      if (currentSession?.user) {
        logger.info('Processing user session', { userId: currentSession.user.id })
        
        let authUser: AuthUser
        
        // Try to load profile with shorter timeout and better fallback
        try {
          // Set a much shorter timeout for profile loading
          const profilePromise = loadUserProfile(currentSession.user)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile load timeout')), 2000)
          )
          
          authUser = await Promise.race([profilePromise, timeoutPromise]) as AuthUser
          logger.info('User profile loaded successfully', authUser)
        } catch (error) {
          logger.error('Profile loading failed, using fallback', error)
          // Create fallback user immediately
          authUser = createFallbackUser(currentSession.user)
          logger.info('Using fallback user', authUser)
        }
        
        // For admin users without hotel, create one in background but don't block UI
        if (authUser.role === 'admin' && !authUser.hotelId && authUser.id === currentSession.user.id) {
          logger.info('Admin without hotel detected, creating default hotel in background');
          // Don't await this - let it happen in background
          createDefaultHotel(authUser.id)
            .then(hotel => {
              authUser.hotelId = hotel.id;
              setUser({...authUser}); // Update with hotel ID when ready
              logger.info('Default hotel created for admin', { hotelId: hotel.id, hotelName: hotel.name });
            })
            .catch(hotelError => {
              logger.error('Failed to create hotel in background', hotelError);
            });
        }
        
        setUser(authUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      logger.error('Error in updateUserState', error)
      setUser(null)
    } finally {
      // Always clear loading state quickly
      setIsLoading(false)
    }
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
        
        // Get current session with timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve({ data: { session: null }, error: new Error('Session timeout') }), 3000)
        )
        
        const { data: { session: currentSession }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any
        
        if (error) {
          logger.error('Error getting session, continuing with no session', error)
          if (mounted) {
            setIsLoading(false)
          }
          return
        }
        
        if (currentSession?.user && mounted) {
          logger.info('Found existing session')
          setSession(currentSession)
          await updateUserState(currentSession)
        } else {
          logger.info('No existing session found')
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

    // Set up auth state listener with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      logger.info('Auth state changed', { event, hasSession: !!session })
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session)
          await updateUserState(session)
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        logger.error('Error in auth state change handler', error)
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
