
import React, { useState, useEffect } from 'react'
import { Hotel, UserCheck, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from './SimpleAuthProvider'
import { AuthRedirect } from './AuthRedirect'
import AdminLoginForm from '../login/AdminLoginForm'
import AdminRegistrationForm from '../login/AdminRegistrationForm'

export const ModernAuthForm = () => {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('login')

  // If user is already authenticated, redirect them
  if (!isLoading && user) {
    return <AuthRedirect />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm">
              <Hotel className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Roomlix</h1>
          </div>
          <p className="text-white/80 text-lg">Hotel Management System</p>
        </div>

        {/* Auth Forms */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Welcome</CardTitle>
            <CardDescription className="text-white/70">
              Access your hotel management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <AdminLoginForm onSuccess={() => {}} />
              </TabsContent>
              
              <TabsContent value="register" className="mt-6">
                <AdminRegistrationForm 
                  onRegistered={() => setActiveTab('login')}
                  onCancel={() => setActiveTab('login')}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
