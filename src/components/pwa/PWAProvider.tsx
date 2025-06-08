
import React, { createContext, useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X } from "lucide-react";

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  showInstallPrompt: () => void;
  dismissInstallPrompt: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within PWAProvider");
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show install prompt after a delay (not immediately)
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const dismissInstallPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <PWAContext.Provider value={{
      isInstallable,
      isInstalled,
      showInstallPrompt,
      dismissInstallPrompt
    }}>
      {children}
      
      {/* Install prompt */}
      {showPrompt && isInstallable && !isInstalled && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Install Roomlix</CardTitle>
                <Button variant="ghost" size="icon" onClick={dismissInstallPrompt}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Install Roomlix on your device for quick access and offline functionality.
              </p>
              <div className="flex gap-2">
                <Button onClick={showInstallPrompt} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
                <Button variant="outline" onClick={dismissInstallPrompt}>
                  Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PWAContext.Provider>
  );
};
