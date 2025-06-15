
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { logger } from '@/utils/logger'

interface AuthUser {
  id: string
  email: string
  name?: string
  role: 'admin' | 'staff' | 'guest'
  hotelId?: string
  roomNumber?: string
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  guestSignIn: (hotelCode: string, roomCode: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const SimpleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    logger.info('Initializing auth provider', null, 'SimpleAuthProvider')

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logger.error('Error getting initial session', error, 'SimpleAuthProvider')
      } else {
        logger.info('Initial session retrieved', { hasSession: !!session }, 'SimpleAuthProvider')
        setSession(session)
        if (session?.user) {
          loadUserProfile(session.user)
        }
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { event, hasSession: !!session }, 'SimpleAuthProvider')
      
      setSession(session)
      
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      logger.info('Cleaning up auth subscription', null, 'SimpleAuthProvider')
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      logger.info('Loading user profile', { userId: supabaseUser.id }, 'SimpleAuthProvider')
      
      // Try to get user from our users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle()

      if (error) {
        logger.error('Error loading user profile', error, 'SimpleAuthProvider')
        throw error
      }

      if (userData) {
        const authUser: AuthUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          hotelId: userData.hotel_id,
          roomNumber: userData.room_number
        }
        
        logger.info('User profile loaded successfully', authUser, 'SimpleAuthProvider')
        setUser(authUser)
      } else {
        // Create basic user profile if it doesn't exist
        logger.info('Creating new user profile', { email: supabaseUser.email }, 'SimpleAuthProvider')
        
        const newUserData = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          role: 'admin' as const,
          password_hash: 'handled_by_auth',
          needs_password_setup: false,
          email_verified: true
        }

        const { error: insertError } = await supabase
          .from('users')
          .insert(newUserData)

        if (insertError) {
          logger.error('Error creating user profile', insertError, 'SimpleAuthProvider')
          throw insertError
        }

        const authUser: AuthUser = {
          id: newUserData.id,
          email: newUserData.email,
          name: newUserData.name,
          role: newUserData.role
        }
        
        logger.info('New user profile created', authUser, 'SimpleAuthProvider')
        setUser(authUser)
      }
    } catch (error) {
      logger.error('Failed to load user profile', error, 'SimpleAuthProvider')
      // Don't throw - just log the error and continue
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in', { email }, 'SimpleAuthProvider')
      setIsLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        logger.error('Sign in failed', error, 'SimpleAuthProvider')
        throw error
      }
      
      logger.info('Sign in successful', null, 'SimpleAuthProvider')
    } catch (error) {
      logger.error('Sign in error', error, 'SimpleAuthProvider')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      logger.info('Attempting sign up', { email, name }, 'SimpleAuthProvider')
      setIsLoading(true)
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
          data: { name, role: 'admin' }
        }
      })
      
      if (error) {
        logger.error('Sign up failed', error, 'SimpleAuthProvider')
        throw error
      }
      
      logger.info('Sign up successful', null, 'SimpleAuthProvider')
    } catch (error) {
      logger.error('Sign up error', error, 'SimpleAuthProvider')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      logger.info('Attempting sign out', null, 'SimpleAuthProvider')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logger.error('Sign out failed', error, 'SimpleAuthProvider')
        throw error
      }
      
      logger.info('Sign out successful', null, 'SimpleAuthProvider')
      setUser(null)
      setSession(null)
    } catch (error) {
      logger.error('Sign out error', error, 'SimpleAuthProvider')
      throw error
    }
  }

  const guestSignIn = async (hotelCode: string, roomCode: string) => {
    try {
      logger.info('Guest sign in attempt', { hotelCode, roomCode }, 'SimpleAuthProvider')
      
      const guestUser: AuthUser = {
        id: `guest-${Date.now()}`,
        email: `guest-${hotelCode}-${roomCode}@temp.com`,
        name: 'Guest User',
        role: 'guest',
        hotelId: hotelCode,
        roomNumber: roomCode
      }
      
      setUser(guestUser)
      logger.info('Guest sign in successful', guestUser, 'SimpleAuthProvider')
    } catch (error) {
      logger.error('Guest sign in error', error, 'SimpleAuthProvider')
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    guestSignIn
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
