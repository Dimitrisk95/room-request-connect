
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // SQL to create the delete_user_and_related_data function
    const { error: createFunctionError } = await supabaseClient.rpc('execute_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.delete_user_and_related_data(user_id_param UUID)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Delete audit logs first 
          DELETE FROM public.user_audit_log WHERE user_id = user_id_param;
          
          -- Delete any requests assigned to this user
          UPDATE public.requests SET assigned_to = NULL WHERE assigned_to = user_id_param;
          
          -- Delete the user
          DELETE FROM public.users WHERE id = user_id_param;
          
          RETURN TRUE;
        END;
        $$;
      `
    });

    if (createFunctionError) {
      console.error("Error creating function:", createFunctionError);
      throw createFunctionError;
    }

    // Create a trigger to handle cascading deletes
    const { error: createTriggerError } = await supabaseClient.rpc('execute_sql', {
      sql: `
        DROP TRIGGER IF EXISTS delete_user_cleanup ON public.users;
        
        CREATE TRIGGER delete_user_cleanup
        BEFORE DELETE ON public.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_delete_user_cleanup();
        
        CREATE OR REPLACE FUNCTION public.handle_delete_user_cleanup()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Clean up audit logs
          DELETE FROM public.user_audit_log WHERE user_id = OLD.id;
          
          -- Update assigned requests
          UPDATE public.requests SET assigned_to = NULL WHERE assigned_to = OLD.id;
          
          RETURN OLD;
        END;
        $$;
      `
    });

    if (createTriggerError) {
      console.error("Error creating trigger:", createTriggerError);
      throw createTriggerError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
