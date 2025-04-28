
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types";

interface UsePasswordResetProps {
  onSuccess: (email: string) => void;
  onError: (error: Error) => void;
}

export const usePasswordReset = ({
  onSuccess,
  onError,
}: UsePasswordResetProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const resetPassword = async (staff: StaffMember) => {
    try {
      setIsProcessing(true);
      
      // Call the password reset edge function
      const { error } = await supabase.functions.invoke('reset-password-email', {
        body: { 
          email: staff.email,
          name: staff.name
        }
      });

      if (error) throw error;
      
      onSuccess(staff.email);
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      onError(error instanceof Error ? error : new Error(error.message || "An unknown error occurred"));
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    resetPassword,
    isProcessing
  };
};
