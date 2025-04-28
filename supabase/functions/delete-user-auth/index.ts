
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
    // Parse request body
    const { userId, email } = await req.json();
    
    if (!userId && !email) {
      return new Response(
        JSON.stringify({ error: "Either userId or email must be provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Create a Supabase client with service role key (admin rights)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    let userToDelete = null;
    
    // If email is provided but not userId, first get the user ID
    if (email && !userId) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin
        .listUsers();
      
      if (userError) {
        throw userError;
      }
      
      userToDelete = userData.users.find(user => user.email === email);
      if (!userToDelete) {
        return new Response(
          JSON.stringify({ message: "User not found in Auth system, may already be deleted" }),
          {
            status: 200, // Not an error if already deleted
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      userId = userToDelete.id;
    }
    
    // Delete the user from Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin
      .deleteUser(userId);
    
    if (deleteError) {
      // Special handling for "User not found" - not an error if already deleted
      if (deleteError.message.includes("User not found")) {
        return new Response(
          JSON.stringify({ message: "User not found in Auth system, may already be deleted" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw deleteError;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "User successfully deleted from Auth system" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in delete-user-auth function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete user from Auth system",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
