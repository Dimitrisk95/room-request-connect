
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "./components/auth/SimpleAuthProvider";
import { AppRoutes } from "./components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
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

function App() {
  logger.info('Application starting');
  
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
