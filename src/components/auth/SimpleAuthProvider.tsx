
import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Session } from '@supabase/supabase-js'
import { logger } from '@/utils/logger'
import { AuthContext } from './AuthContext'
import { AuthUser, AuthContextType } from './types'
import { loadUserProfile, createFallbackUser } from './userProfileService'
import { signIn, signUp, signOut, guestSignIn } from './authService'

interface AuthProviderProps {
  children: React.ReactNode
}

export const SimpleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const updateUserState = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      try {
        const authUser = await loadUserProfile(currentSession.user)
        setUser(authUser)
        logger.info('User profile set', authUser)
      } catch (error) {
        logger.error('Profile loading failed', error)
        setUser(createFallbackUser(currentSession.user))
      }
    } else {
      setUser(null)
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
        }
        
        // Always set loading to false after initial check
        if (mounted) {
          setIsLoading(false)
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
        // Clear any pending hotel ID when user signs out
        localStorage.removeItem("pendingHotelId")
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
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    guestSignIn: handleGuestSignIn
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth } from './useAuth'
