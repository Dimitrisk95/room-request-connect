import React, { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Hotel, MessageSquare, User, Users, Building, Settings, Key, BarChart3 } from "lucide-react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import MobileHeader from "@/components/ui/header/MobileHeader";
import DesktopHeader from "@/components/ui/header/DesktopHeader";
import TutorialManager from "@/components/ui/tutorial/TutorialManager";
import MobileLayout from "@/components/mobile/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardShellProps {
  children: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const { announceToScreenReader } = useAccessibility();
  const [showNotifications, setShowNotifications] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

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

  const handleLogout = () => {
    announceToScreenReader("Logging out...");
    signOut();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    announceToScreenReader(showNotifications ? "Notifications closed" : "Notifications opened");
  };

  // Get page title for mobile header
  const getPageTitle = () => {
    const currentNav = navigation.find(nav => nav.href === location.pathname);
    return currentNav?.name || "Dashboard";
  };

  // Mobile layout
  if (isMobile) {
    return (
      <>
        <MobileLayout
          title={getPageTitle()}
          onNotificationClick={toggleNotifications}
        >
          {children}
        </MobileLayout>
        
        <NotificationCenter 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
        
        <TutorialManager navigation={navigation} />
      </>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        navigation={navigation}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader onToggleNotifications={toggleNotifications} />

        {/* Desktop header */}
        <DesktopHeader onToggleNotifications={toggleNotifications} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 bg-background" role="main">
          {children}
        </main>
      </div>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Tutorial Manager */}
      <TutorialManager navigation={navigation} />
    </div>
  );
};

export default DashboardShell;
