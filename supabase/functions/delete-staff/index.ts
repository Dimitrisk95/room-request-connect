
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the session of the authenticated user
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // First, check if the user is an admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (adminError || adminData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Only administrators can delete staff members" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Delete related audit logs first
    const { error: auditLogError } = await supabaseClient
      .from('user_audit_log')
      .delete()
      .eq('user_id', userId);
      
    if (auditLogError) {
      console.error("Error deleting audit logs:", auditLogError);
      // Continue anyway, as we'll try to delete the user
    }
    
    // Delete the user
    const { error: userError } = await supabaseClient
      .from('users')
      .delete()
      .eq('id', userId);
      
    if (userError) {
      return new Response(
        JSON.stringify({
          error: "Failed to delete user",
          details: userError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error in delete-staff function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
