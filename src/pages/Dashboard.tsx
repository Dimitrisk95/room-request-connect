
import React from 'react';
import { useAuth } from '@/components/auth/SimpleAuthProvider';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Hotel, Users, Calendar, Settings, LogOut, BarChart3 } from 'lucide-react';
import { logger } from '@/utils/logger';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  logger.info('Dashboard rendered', { user }, 'Dashboard');

  const handleSignOut = async () => {
    try {
      await signOut();
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Error signing out', error);
    }
  };

  const quickActions = [
    {
      title: 'Room Management',
      description: 'Manage rooms, bookings, and availability',
      icon: Hotel,
      color: 'from-blue-600 to-purple-600',
      action: () => logger.info('Room management clicked')
    },
    {
      title: 'Staff Management',
      description: 'Handle staff accounts and permissions',
      icon: Users,
      color: 'from-green-600 to-blue-600',
      action: () => logger.info('Staff management clicked')
    },
    {
      title: 'Reservations',
      description: 'View and manage reservations',
      icon: Calendar,
      color: 'from-orange-600 to-red-600',
      action: () => logger.info('Reservations clicked')
    },
    {
      title: 'Analytics',
      description: 'View reports and analytics',
      icon: BarChart3,
      color: 'from-purple-600 to-pink-600',
      action: () => logger.info('Analytics clicked')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-white/70 mt-1">
            {user?.role === 'admin' ? 'Hotel Administrator' : 
             user?.role === 'staff' ? 'Staff Member' : 
             user?.role === 'guest' ? `Guest in Room ${user?.roomNumber}` : 'User'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <ModernButton variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </ModernButton>
          <ModernButton variant="destructive" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </ModernButton>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <ModernCard key={index} className="cursor-pointer hover:scale-105 transition-transform">
            <ModernCardHeader>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <ModernCardTitle className="text-lg">{action.title}</ModernCardTitle>
              <ModernCardDescription>{action.description}</ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent>
              <ModernButton variant="outline" className="w-full" onClick={action.action}>
                Open
              </ModernButton>
            </ModernCardContent>
          </ModernCard>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Recent Activity</ModernCardTitle>
            <ModernCardDescription>Latest updates and notifications</ModernCardDescription>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded bg-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">System initialized successfully</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-white/5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">User {user?.name} logged in</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-white/5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-sm">Dashboard loaded</span>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>System Status</ModernCardTitle>
            <ModernCardDescription>Current system health</ModernCardDescription>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Authentication</span>
                <span className="text-green-500 text-sm font-medium">✓ Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="text-green-500 text-sm font-medium">✓ Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Logging</span>
                <span className="text-green-500 text-sm font-medium">✓ Operational</span>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Quick Stats</ModernCardTitle>
            <ModernCardDescription>Key metrics at a glance</ModernCardDescription>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">User Role</span>
                <span className="text-blue-500 text-sm font-medium capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Session Active</span>
                <span className="text-green-500 text-sm font-medium">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hotel ID</span>
                <span className="text-purple-500 text-sm font-medium">
                  {user?.hotelId ? user.hotelId.slice(0, 8) + '...' : 'Not Set'}
                </span>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </div>
  );
};

export default Dashboard;
