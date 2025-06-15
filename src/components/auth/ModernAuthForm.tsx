
import React, { useState } from 'react'
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card'
import { ModernInput } from '@/components/ui/modern-input'
import { ModernButton } from '@/components/ui/modern-button'
import { useAuth } from './SimpleAuthProvider'
import { useLogger } from '@/utils/logger'
import { Hotel, User, Users, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'staff' | 'guest' | 'admin'

export const ModernAuthForm: React.FC = () => {
  const { signIn, signUp, guestSignIn, isLoading } = useAuth()
  const logger = useLogger()
  const navigate = useNavigate()
  
  const [mode, setMode] = useState<AuthMode>('admin')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localLoading, setLocalLoading] = useState(false)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [hotelCode, setHotelCode] = useState('')
  const [roomCode, setRoomCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLocalLoading(true)
    
    try {
      if (mode === 'guest') {
        await guestSignIn(hotelCode, roomCode)
        logger.info('Guest login successful')
        navigate('/dashboard')
      } else if (isSignUp) {
        await signUp(email, password, name)
        logger.info('Admin registration successful')
        navigate('/dashboard')
      } else {
        await signIn(email, password)
        logger.info('Staff/Admin login successful')
        navigate('/dashboard')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed'
      setError(errorMessage)
      logger.error('Authentication error', err)
    } finally {
      setLocalLoading(false)
    }
  }

  const isFormLoading = isLoading || localLoading

  const renderModeSelector = () => (
    <div className="grid grid-cols-3 w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1 mb-6">
      {(['admin', 'staff', 'guest'] as AuthMode[]).map((authMode) => (
        <ModernButton
          key={authMode}
          variant={mode === authMode ? "default" : "ghost"}
          className="text-xs px-2 py-2"
          onClick={() => {
            setMode(authMode)
            setError(null)
          }}
          type="button"
          disabled={isFormLoading}
        >
          {authMode === 'admin' && <Hotel className="h-3 w-3 mr-1" />}
          {authMode === 'staff' && <Users className="h-3 w-3 mr-1" />}
          {authMode === 'guest' && <User className="h-3 w-3 mr-1" />}
          {authMode === 'admin' ? 'Admin' : 
           authMode === 'staff' ? 'Staff' : 'Guest'}
        </ModernButton>
      ))}
    </div>
  )

  const renderStaffAdminForm = () => (
    <div className="space-y-4">
      {mode === 'admin' && (
        <div className="grid grid-cols-2 w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1 mb-4">
          <ModernButton
            variant={!isSignUp ? "default" : "ghost"}
            className="text-sm py-2"
            onClick={() => {
              setIsSignUp(false)
              setError(null)
            }}
            type="button"
            disabled={isFormLoading}
          >
            Login
          </ModernButton>
          <ModernButton
            variant={isSignUp ? "default" : "ghost"}
            className="text-sm py-2"
            onClick={() => {
              setIsSignUp(true)
              setError(null)
            }}
            type="button"
            disabled={isFormLoading}
          >
            Register
          </ModernButton>
        </div>
      )}
      
      {isSignUp && (
        <ModernInput
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isFormLoading}
        />
      )}
      
      <ModernInput
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isFormLoading}
      />
      <ModernInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isFormLoading}
      />
    </div>
  )

  const renderGuestForm = () => (
    <div className="space-y-4">
      <ModernInput
        placeholder="Hotel Code (e.g. HOTEL123)"
        value={hotelCode}
        onChange={(e) => setHotelCode(e.target.value)}
        required
        disabled={isFormLoading}
      />
      <ModernInput
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        required
        disabled={isFormLoading}
      />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <ModernCard className="border-white/20 bg-white/10 backdrop-blur-md">
          <ModernCardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3">
                <Hotel className="h-8 w-8 text-white" />
              </div>
            </div>
            <ModernCardTitle className="text-2xl text-white">Roomlix</ModernCardTitle>
            <ModernCardDescription className="text-sm text-white/70">
              {mode === 'guest' 
                ? 'Connect with your hotel for a seamless stay'
                : mode === 'admin' 
                  ? 'Hotel Administration Portal'
                  : 'Staff Management Portal'
              }
            </ModernCardDescription>
          </ModernCardHeader>
          
          <ModernCardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderModeSelector()}
              
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}
              
              {mode === 'guest' ? renderGuestForm() : renderStaffAdminForm()}
              
              <ModernButton 
                type="submit" 
                className="w-full mt-6"
                disabled={isFormLoading}
              >
                {isFormLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'guest' ? 'Connecting...' : isSignUp ? 'Creating...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {mode === 'guest' ? 'Connect to Room' : 
                     isSignUp ? 'Create Admin Account' : 
                     `Sign In as ${mode === 'admin' ? 'Admin' : 'Staff'}`}
                  </>
                )}
              </ModernButton>
            </form>
          </ModernCardContent>
        </ModernCard>
      </div>
    </div>
  )
}
