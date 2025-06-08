
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff } from "lucide-react";

interface OfflineContextType {
  isOnline: boolean;
  hasBeenOffline: boolean;
}

const OfflineContext = React.createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = React.useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider");
  }
  return context;
};

interface OfflineProviderProps {
  children: React.ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [hasBeenOffline, setHasBeenOffline] = React.useState<boolean>(false);
  const [showReconnectedMessage, setShowReconnectedMessage] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (hasBeenOffline) {
        setShowReconnectedMessage(true);
        setTimeout(() => setShowReconnectedMessage(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasBeenOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasBeenOffline]);

  return (
    <OfflineContext.Provider value={{ isOnline, hasBeenOffline }}>
      {children}
      
      {/* Offline notification */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="flex items-center gap-2 py-3">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                You're offline. Some features may be limited.
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reconnected notification */}
      {showReconnectedMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center gap-2 py-3">
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Back online! All features are available.
              </span>
            </CardContent>
          </Card>
        </div>
      )}
    </OfflineContext.Provider>
  );
};

// Service worker registration utility
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New version available. Please refresh.');
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};
