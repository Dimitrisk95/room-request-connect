
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider, useAuth } from "./components/auth/SimpleAuthProvider";
import { ModernAuthForm } from "./components/auth/ModernAuthForm";
import { LogViewer } from "./components/debug/LogViewer";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import { logger } from "./utils/logger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        logger.error('Query failed', { failureCount, error: error?.message });
        return failureCount < 2;
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    logger.info('Redirecting to auth - no user found');
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  
  logger.info('App rendering', { hasUser: !!user, userRole: user?.role });
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={!user ? <ModernAuthForm /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
      <LogViewer />
      <Toaster />
    </BrowserRouter>
  );
};

function App() {
  logger.info('Application starting');
  
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <AppContent />
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
