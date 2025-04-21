import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Hotel, LogOut, MessageSquare, User, Users, Shield, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";

interface DashboardShellProps {
  children: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  // Basic navigation for all user roles
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Hotel },
    { name: "Rooms", href: "/rooms", icon: Building },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Requests", href: "/requests", icon: MessageSquare },
    { name: "Staff", href: "/staff", icon: Users },
  ];
  
  // Admin-only navigation items
  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
    { name: "Staff Management", href: "/staff-management", icon: User },
  ];
  
  // Combine navigation based on user role
  const navigation = user?.role === "admin" 
    ? [...baseNavigation, ...adminNavigation] 
    : baseNavigation;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-primary text-primary-foreground">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-bold">Room Request Connect</h1>
            </div>
            <div className="flex flex-col flex-grow">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-primary-foreground hover:bg-primary-foreground/10",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
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
                  onClick={logout}
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
          <h1 className="text-lg font-bold">Room Request Connect</h1>
          {/* Mobile menu button would go here */}
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
