
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types";

interface UseStaffDeletionProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useStaffDeletion = ({
  onSuccess,
  onError,
  setIsProcessing,
}: UseStaffDeletionProps) => {
  const handleDeleteStaff = async (selectedStaff: StaffMember) => {
    try {
      setIsProcessing(true);
      
      // Step 1: Delete from database first
      try {
        const { data, error: rpcError } = await supabase.rpc(
          'delete_user_and_related_data' as any, 
          { user_id_param: selectedStaff.id }
        );
        
        if (rpcError) {
          console.error("RPC function error:", rpcError);
          // Fall back to regular deletion
          await manualDeletion(selectedStaff);
        }
      } catch (rpcErr) {
        console.error("RPC function error:", rpcErr);
        // Fall back to regular deletion
        await manualDeletion(selectedStaff);
      }
      
      // Step 2: Delete the user from Supabase Auth system
      try {
        const { error: authDeleteError } = await supabase.functions.invoke('delete-user-auth', {
          body: { 
            userId: selectedStaff.id,
            email: selectedStaff.email
          }
        });
        
        if (authDeleteError) {
          console.error("Error deleting user from Auth:", authDeleteError);
          throw authDeleteError;
        }
      } catch (authErr: any) {
        console.error("Error calling delete-user-auth function:", authErr);
        throw new Error(`Failed to delete user from authentication system: ${authErr.message || authErr}`);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      onError(error instanceof Error ? error : new Error(error.message || "An unknown error occurred"));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Manual deletion as fallback
  const manualDeletion = async (staff: StaffMember) => {
    // First, delete any entries in the user_audit_log table that reference this user
    const { error: auditLogError } = await supabase
      .from('user_audit_log')
      .delete()
      .eq('user_id', staff.id);
      
    if (auditLogError) {
      console.error("Error deleting audit logs:", auditLogError);
      // Try using the Edge Function instead
      try {
        const { error: functionError } = await supabase.functions.invoke('delete-staff', {
          body: { userId: staff.id }
        });
        
        if (!functionError) {
          return; // Success via edge function
        } else {
          throw functionError;
        }
      } catch (fnError) {
        console.error("Edge function error:", fnError);
        // Continue with direct delete attempt
      }
    }
    
    // Now delete the user from the users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', staff.id);

    if (error) {
      throw error;
    }
  };

  return {
    handleDeleteStaff,
  };
};
