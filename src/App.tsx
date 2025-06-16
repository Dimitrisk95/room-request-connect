
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider, useAuth } from "./components/auth/SimpleAuthProvider";
import { ModernAuthForm } from "./components/auth/ModernAuthForm";
import { LogViewer } from "./components/debug/LogViewer";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Index from "./pages/Index";
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
  
  logger.info('ProtectedRoute check', { user: !!user, isLoading });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user, isLoading } = useAuth();
  
  logger.info('AppContent render', { user: !!user, isLoading, userRole: user?.role });
  
  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Main landing page - always accessible */}
        <Route path="/" element={<Index />} />
        
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
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
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
