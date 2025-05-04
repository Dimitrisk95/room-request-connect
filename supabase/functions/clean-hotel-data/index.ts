
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

    // Clear all user auth data first using the auth admin API
    const { data: users, error: usersError } = await supabaseClient.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    // Delete each user from the auth system
    for (const user of users.users) {
      console.log(`Deleting auth user: ${user.email}`);
      await supabaseClient.auth.admin.deleteUser(user.id);
    }
    
    // Clear data from tables in the correct order to avoid foreign key constraint violations
    // Note: user_audit_log must be deleted first because it has foreign keys to users
    const tables = ['user_audit_log', 'users', 'rooms', 'requests', 'hotels'];
    
    for (const table of tables) {
      console.log(`Clearing table: ${table}`);
      const { error } = await supabaseClient.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error(`Error clearing ${table}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "All hotel data cleared. You can now register again." }),
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
