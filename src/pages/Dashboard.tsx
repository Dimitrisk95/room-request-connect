
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, Users, Calendar, Settings, ClipboardList, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // If admin doesn't have a hotel, show setup prompt instead of redirecting
  if (user?.role === 'admin' && !user?.hotelId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-2">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Roomlix</h1>
                  <p className="text-white/70 text-sm">Hotel Management System</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-white/70 text-sm capitalize">{user?.role}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Roomlix, {user?.name}!
            </h2>
            <p className="text-white/70 mb-8">
              You need to set up your hotel before you can access the dashboard.
            </p>
            
            <Card className="border-white/20 bg-white/10 backdrop-blur-md max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center">
                  <Hotel className="h-6 w-6 mr-2" />
                  Setup Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  To get started with managing your hotel, you'll need to complete the setup process.
                </p>
                <Button 
                  onClick={() => navigate('/setup')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Setup My Hotel
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Room Management",
      description: "Manage rooms, availability, and room assignments",
      icon: Hotel,
      path: "/rooms",
      permission: user?.can_manage_rooms || user?.role === 'admin'
    },
    {
      title: "Staff Management", 
      description: "Manage staff accounts and permissions",
      icon: Users,
      path: "/staff-management",
      permission: user?.can_manage_staff || user?.role === 'admin'
    },
    {
      title: "Reservations",
      description: "View and manage hotel reservations",
      icon: Calendar,
      path: "/reservations",
      permission: true
    },
    {
      title: "Guest Requests",
      description: "Handle guest service requests and complaints",
      icon: ClipboardList,
      path: "/requests",
      permission: true
    },
    {
      title: "Settings",
      description: "Hotel settings and configuration",
      icon: Settings,
      path: "/settings",
      permission: user?.role === 'admin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-2">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Roomlix</h1>
                <p className="text-white/70 text-sm">Hotel Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-white/70 text-sm capitalize">{user?.role}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-white/70">
            Manage your hotel operations from your dashboard
          </p>
        </div>

        {/* Quick Actions for Admin */}
        {user?.role === 'admin' && (
          <div className="mb-8">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-16 bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => navigate('/rooms')}
                  >
                    <div className="text-center">
                      <Hotel className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm">Add Room</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-16 bg-gradient-to-r from-blue-600 to-cyan-600"
                    onClick={() => navigate('/staff-management')}
                  >
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm">Add Staff</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-16 bg-gradient-to-r from-purple-600 to-pink-600"
                    onClick={() => navigate('/settings')}
                  >
                    <div className="text-center">
                      <Settings className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm">Settings</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards
            .filter(card => card.permission)
            .map((card, index) => (
            <Card 
              key={index}
              className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-2">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hotel Info */}
        {user?.hotelId && (
          <div className="mt-8">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Hotel Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white/70">
                  <p>Hotel ID: {user.hotelId}</p>
                  <p>Your Role: {user.role}</p>
                  {user.can_manage_rooms && (
                    <p className="text-green-400">✓ Can manage rooms</p>
                  )}
                  {user.can_manage_staff && (
                    <p className="text-green-400">✓ Can manage staff</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
