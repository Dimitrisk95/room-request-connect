
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

  // Create fallback user from Supabase user
  const createFallbackUser = (supabaseUser: SupabaseUser): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      role: 'admin' // Default to admin for fallback
    }
  }

  const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<AuthUser> => {
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
          
          // Load user profile in background
          loadUserProfile(currentSession.user).then((authUser) => {
            if (mounted) {
              setUser(authUser)
              logger.info('User profile set', authUser)
            }
          }).catch((error) => {
            logger.error('Profile loading failed', error)
            if (mounted) {
              setUser(createFallbackUser(currentSession.user))
            }
          })
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
        
        // Load user profile in background
        loadUserProfile(session.user).then((authUser) => {
          if (mounted) {
            setUser(authUser)
            logger.info('User profile set from auth change', authUser)
          }
        }).catch((error) => {
          logger.error('Profile loading failed in auth change', error)
          if (mounted) {
            setUser(createFallbackUser(session.user))
          }
        })
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
      }
    })

    // Initialize auth
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in', { email })
      
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        logger.error('Sign in failed', error)
        throw error
      }
      
      logger.info('Sign in successful')
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
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
        throw error
      }
      
      logger.info('Sign up successful')
    } catch (error) {
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
      logger.info('Guest sign in successful', guestUser)
    } catch (error) {
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
