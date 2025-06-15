
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

interface RateLimitState {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimitContextType {
  checkRateLimit: (action: string, limit: number, windowMs: number) => boolean;
  getRemainingAttempts: (action: string, limit: number, windowMs: number) => number;
}

const RateLimitContext = React.createContext<RateLimitContextType | undefined>(undefined);

export const useRateLimit = () => {
  const context = React.useContext(RateLimitContext);
  if (!context) {
    throw new Error("useRateLimit must be used within a RateLimitProvider");
  }
  return context;
};

interface RateLimitProviderProps {
  children: React.ReactNode;
}

export const RateLimitProvider: React.FC<RateLimitProviderProps> = ({ children }) => {
  const [state, setState] = React.useState<RateLimitState>({});
  const { toast } = useToast();

  const checkRateLimit = React.useCallback((action: string, limit: number, windowMs: number): boolean => {
    const now = Date.now();
    const key = action;
    
    setState(prevState => {
      const current = prevState[key];
      
      // If no previous record or window has expired, reset
      if (!current || now >= current.resetTime) {
        return {
          ...prevState,
          [key]: {
            count: 1,
            resetTime: now + windowMs
          }
        };
      }
      
      // If under limit, increment
      if (current.count < limit) {
        return {
          ...prevState,
          [key]: {
            ...current,
            count: current.count + 1
          }
        };
      }
      
      // Rate limit exceeded
      const resetMinutes = Math.ceil((current.resetTime - now) / 60000);
      toast({
        title: "Rate limit exceeded",
        description: `Too many attempts. Please try again in ${resetMinutes} minute${resetMinutes > 1 ? 's' : ''}.`,
        variant: "destructive"
      });
      
      return prevState;
    });
    
    const currentState = state[key];
    return !currentState || now >= currentState.resetTime || currentState.count < limit;
  }, [state, toast]);

  const getRemainingAttempts = React.useCallback((action: string, limit: number, windowMs: number): number => {
    const now = Date.now();
    const current = state[action];
    
    if (!current || now >= current.resetTime) {
      return limit;
    }
    
    return Math.max(0, limit - current.count);
  }, [state]);

  return (
    <RateLimitContext.Provider value={{ checkRateLimit, getRemainingAttempts }}>
      {children}
    </RateLimitContext.Provider>
  );
};
