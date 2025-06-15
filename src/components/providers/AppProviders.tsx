
import React, { ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/context";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { RateLimitProvider } from "@/components/security/RateLimitProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { PWAProvider } from "@/components/pwa/PWAProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <RateLimitProvider>
          <Router>
            <AuthProvider>
              <PWAProvider>
                {children}
                <Toaster />
              </PWAProvider>
            </AuthProvider>
          </Router>
        </RateLimitProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};
