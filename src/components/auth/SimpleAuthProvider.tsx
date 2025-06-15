
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
    let mounted = true

    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth...')
        
        // Check for existing session first
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          logger.error('Error getting session', error)
          if (mounted) setIsLoading(false)
          return
        }

        if (currentSession?.user && mounted) {
          logger.info('Found existing session')
          setSession(currentSession)
          await loadUserProfile(currentSession.user)
        }
        
        if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        logger.error('Session initialization error', error)
        if (mounted) setIsLoading(false)
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      logger.info('Auth state changed', { event, hasSession: !!session })
      
      if (event === 'SIGNED_IN' && session?.user) {
        setSession(session)
        await loadUserProfile(session.user)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
      }
      
      // Always set loading to false after auth state change
      if (mounted) {
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

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      logger.info('Loading user profile', { userId: supabaseUser.id })
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        logger.error('Error loading user profile', error)
        throw error
      }

      let authUser: AuthUser

      if (userData) {
        authUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          hotelId: userData.hotel_id,
          roomNumber: userData.room_number,
          can_manage_rooms: userData.can_manage_rooms,
          can_manage_staff: userData.can_manage_staff
        }
      } else {
        // Create basic user profile for new users
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
        }

        authUser = {
          id: newUserData.id,
          email: newUserData.email,
          name: newUserData.name,
          role: newUserData.role
        }
      }
      
      logger.info('User profile loaded', authUser)
      setUser(authUser)
    } catch (error) {
      logger.error('Failed to load user profile', error)
      
      // Set fallback user to prevent app from breaking
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
      // Loading state will be set to false by auth state change handler
    } catch (error) {
      setIsLoading(false)
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
      // Loading state will be set to false by auth state change handler
    } catch (error) {
      setIsLoading(false)
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
