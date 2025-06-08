
import React, { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Hotel, LogOut, MessageSquare, User, Users, Shield, Building, Settings, Key, Bell, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";
import { useTutorial } from "@/hooks/useTutorial";
import { SpotlightTutorial } from "@/components/tutorials/SpotlightTutorial";
import { getTutorialSteps } from "@/components/tutorials/TutorialContent";

interface DashboardShellProps {
  children: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const { announceToScreenReader } = useAccessibility();
  const [showNotifications, setShowNotifications] = useState(false);
  const { 
    startTutorial, 
    hasTutorialBeenViewed, 
    activeTutorial, 
    currentStep, 
    nextStep, 
    skipTutorial, 
    markTutorialAsViewed 
  } = useTutorial();

  console.log("DashboardShell - user permissions:", {
    role: user?.role,
    can_manage_staff: user?.can_manage_staff,
    can_manage_rooms: user?.can_manage_rooms
  });

  // Basic navigation for all user roles
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Hotel, dataTour: "dashboard", tutorialId: "dashboard" },
    { name: "Rooms", href: "/rooms", icon: Building, dataTour: "rooms", tutorialId: "rooms" },
    { name: "Calendar", href: "/calendar", icon: Calendar, tutorialId: "calendar" },
    { name: "Requests", href: "/requests", icon: MessageSquare, dataTour: "requests", tutorialId: "requests" },
    { name: "Staff", href: "/staff", icon: Users, dataTour: "staff", tutorialId: "staff" },
    { name: "Access Codes", href: "/access-codes", icon: Key, tutorialId: "access-codes" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, dataTour: "analytics", tutorialId: "analytics" },
    { name: "Settings", href: "/settings", icon: Settings, tutorialId: "settings" },
  ];
  
  // Admin-only and permitted staff navigation items
  const permissionBasedNavigation = [];
  
  // Add Staff Management link for users with permission
  if (user?.role === "admin" || user?.can_manage_staff === true) {
    permissionBasedNavigation.push(
      { name: "Staff Management", href: "/staff-management", icon: User, tutorialId: "staff-management" }
    );
  }
  
  // Combine navigation based on user role and permissions
  const navigation = [...baseNavigation, ...permissionBasedNavigation];

  // Check for tutorial on route change
  useEffect(() => {
    const currentRoute = pathname.replace("/", "") || "dashboard";
    const navItem = navigation.find(item => item.href === pathname);
    
    if (navItem?.tutorialId && !hasTutorialBeenViewed(navItem.tutorialId)) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        startTutorial(navItem.tutorialId);
      }, 500);
    }
  }, [pathname, navigation, hasTutorialBeenViewed, startTutorial]);

  const handleLogout = () => {
    announceToScreenReader("Logging out...");
    logout();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    announceToScreenReader(showNotifications ? "Notifications closed" : "Notifications opened");
  };

  const handleTutorialComplete = () => {
    if (activeTutorial) {
      markTutorialAsViewed(activeTutorial);
    }
  };

  // Clean up highlight attributes when tutorial ends
  useEffect(() => {
    if (!activeTutorial) {
      const highlightedElements = document.querySelectorAll('[data-tutorial-highlight]');
      highlightedElements.forEach(el => {
        el.removeAttribute('data-tutorial-highlight');
      });
    }
  }, [activeTutorial]);

  const currentTutorialSteps = activeTutorial ? getTutorialSteps(activeTutorial) : [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-primary text-primary-foreground">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-bold">Roomlix</h1>
            </div>
            <div className="flex flex-col flex-grow">
              <nav className="flex-1 px-2 space-y-1" role="navigation" aria-label="Main navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    data-tour={item.dataTour}
                    className={cn(
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-primary-foreground hover:bg-primary-foreground/10",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? "text-accent-foreground"
                          : "text-primary-foreground group-hover:text-primary-foreground",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex p-4 border-t border-primary-foreground/20">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-white">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-primary-foreground">{user?.name}</p>
                  <p className="text-xs text-primary-foreground/70 capitalize">{user?.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">Roomlix</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="text-primary-foreground hover:bg-primary-foreground/10 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex bg-background border-b p-4 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotifications}
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 bg-background" role="main">
          {children}
        </main>
      </div>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Spotlight Tutorial */}
      <SpotlightTutorial
        isActive={!!activeTutorial}
        steps={currentTutorialSteps}
        currentStep={currentStep}
        onNext={nextStep}
        onSkip={skipTutorial}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
};

export default DashboardShell;
