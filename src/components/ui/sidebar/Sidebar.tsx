
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User } from "@/context/auth/types";

interface SidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    dataTour?: string;
    tutorialId?: string;
  }>;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigation, user, onLogout }) => {
  const { pathname } = useLocation();

  return (
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
              <button
                className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded"
                onClick={onLogout}
                aria-label="Logout"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
