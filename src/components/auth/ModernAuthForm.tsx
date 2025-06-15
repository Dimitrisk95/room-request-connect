
import React, { useState } from 'react'
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card'
import { ModernInput } from '@/components/ui/modern-input'
import { ModernButton } from '@/components/ui/modern-button'
import { useAuth } from './SimpleAuthProvider'
import { useLogger } from '@/utils/logger'
import { Hotel, User, Users, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AuthMode = 'staff' | 'guest' | 'admin'

export const ModernAuthForm: React.FC = () => {
  const { signIn, signUp, guestSignIn, isLoading } = useAuth()
  const logger = useLogger()
  
  const [mode, setMode] = useState<AuthMode>('admin')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [hotelCode, setHotelCode] = useState('')
  const [roomCode, setRoomCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      if (mode === 'guest') {
        await guestSignIn(hotelCode, roomCode)
        logger.info('Guest login successful')
      } else if (isSignUp) {
        await signUp(email, password, name)
        logger.info('Admin registration successful')
      } else {
        await signIn(email, password)
        logger.info('Staff/Admin login successful')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed'
      setError(errorMessage)
      logger.error('Authentication error', err)
    }
  }

  const renderModeSelector = () => (
    <div className="flex w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1 mb-6">
      {(['admin', 'staff', 'guest'] as AuthMode[]).map((authMode) => (
        <ModernButton
          key={authMode}
          variant={mode === authMode ? "default" : "ghost"}
          className="w-full rounded-md text-sm"
          onClick={() => setMode(authMode)}
          type="button"
        >
          {authMode === 'admin' && <Hotel className="h-4 w-4 mr-2" />}
          {authMode === 'staff' && <Users className="h-4 w-4 mr-2" />}
          {authMode === 'guest' && <User className="h-4 w-4 mr-2" />}
          {authMode === 'admin' ? 'Admin Portal' : 
           authMode === 'staff' ? 'Staff Login' : 'Guest Access'}
        </ModernButton>
      ))}
    </div>
  )

  const renderStaffAdminForm = () => (
    <>
      {mode === 'admin' && (
        <div className="flex w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1 mb-4">
          <ModernButton
            variant={!isSignUp ? "default" : "ghost"}
            className="w-full rounded-md text-sm"
            onClick={() => setIsSignUp(false)}
            type="button"
          >
            Login
          </ModernButton>
          <ModernButton
            variant={isSignUp ? "default" : "ghost"}
            className="w-full rounded-md text-sm"
            onClick={() => setIsSignUp(true)}
            type="button"
          >
            Register
          </ModernButton>
        </div>
      )}
      
      {isSignUp && (
        <div className="space-y-4">
          <ModernInput
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      
      <div className="space-y-4">
        <ModernInput
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <ModernInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </>
  )

  const renderGuestForm = () => (
    <div className="space-y-4">
      <ModernInput
        placeholder="Hotel Code (e.g. HOTEL123)"
        value={hotelCode}
        onChange={(e) => setHotelCode(e.target.value)}
        required
      />
      <ModernInput
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        required
      />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <ModernCard className="border-white/20 bg-white/10 backdrop-blur-md">
          <ModernCardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3">
                <Hotel className="h-8 w-8 text-white" />
              </div>
            </div>
            <ModernCardTitle>Roomlix</ModernCardTitle>
            <ModernCardDescription>
              {mode === 'guest' 
                ? 'Connect with your hotel for a seamless stay'
                : mode === 'admin' 
                  ? 'Hotel Administration Portal'
                  : 'Staff Management Portal'
              }
            </ModernCardDescription>
          </ModernCardHeader>
          
          <ModernCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderModeSelector()}
              
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {mode === 'guest' ? renderGuestForm() : renderStaffAdminForm()}
              
              <ModernButton 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'guest' ? 'Connecting...' : isSignUp ? 'Creating Account...' : 'Signing In...'}
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
