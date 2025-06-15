
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
  can_manage_rooms?: boolean
  can_manage_staff?: boolean
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
    logger.info('Initializing auth provider')

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { event, hasSession: !!session })
      
      setSession(session)
      
      if (session?.user) {
        // Use setTimeout to prevent auth deadlock
        setTimeout(async () => {
          await loadUserProfile(session.user)
        }, 0)
      } else {
        setUser(null)
      }
      
      setIsLoading(false)
    })

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logger.error('Error getting initial session', error)
        setIsLoading(false)
        return
      }

      logger.info('Initial session check', { hasSession: !!session })
      setSession(session)
      
      if (session?.user) {
        // Use setTimeout to prevent auth deadlock
        setTimeout(async () => {
          await loadUserProfile(session.user)
          setIsLoading(false)
        }, 0)
      } else {
        setIsLoading(false)
      }
    })

    return () => {
      logger.info('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      logger.info('Loading user profile', { userId: supabaseUser.id })
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle()

      if (error) {
        logger.error('Error loading user profile', error)
        throw error
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
        setUser(authUser)
      } else {
        // Create basic user profile if it doesn't exist
        logger.info('Creating new user profile', { email: supabaseUser.email })
        
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
          logger.error('Error creating user profile', insertError)
          throw insertError
        }

        const authUser: AuthUser = {
          id: newUserData.id,
          email: newUserData.email,
          name: newUserData.name,
          role: newUserData.role
        }
        
        logger.info('New user profile created', authUser)
        setUser(authUser)
      }
    } catch (error) {
      logger.error('Failed to load user profile', error)
      // Set a basic user anyway to prevent infinite loading
      const fallbackUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.email?.split('@')[0] || 'User',
        role: 'admin'
      }
      setUser(fallbackUser)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in', { email })
      setIsLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        logger.error('Sign in failed', error)
        setIsLoading(false)
        throw error
      }
      
      logger.info('Sign in successful')
      // Don't set loading to false here - let the auth state change handler do it
    } catch (error) {
      setIsLoading(false)
      logger.error('Sign in error', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      logger.info('Attempting sign up', { email, name })
      setIsLoading(true)
      
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
        setIsLoading(false)
        throw error
      }
      
      logger.info('Sign up successful')
      // Don't set loading to false here - let the auth state change handler do it
    } catch (error) {
      setIsLoading(false)
      logger.error('Sign up error', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      logger.info('Attempting sign out')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logger.error('Sign out failed', error)
        throw error
      }
      
      logger.info('Sign out successful')
      setUser(null)
      setSession(null)
    } catch (error) {
      logger.error('Sign out error', error)
      throw error
    }
  }

  const guestSignIn = async (hotelCode: string, roomCode: string) => {
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
      
      setUser(guestUser)
      setIsLoading(false)
      logger.info('Guest sign in successful', guestUser)
    } catch (error) {
      setIsLoading(false)
      logger.error('Guest sign in error', error)
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
