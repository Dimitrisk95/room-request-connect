
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    
    console.log('Processing auth user creation for:', record.email)

    // Create user profile in users table
    const { error } = await supabaseClient
      .from('users')
      .insert({
        id: record.id,
        name: record.raw_user_meta_data?.name || record.email?.split('@')[0] || 'User',
        email: record.email,
        role: record.raw_user_meta_data?.role || 'admin',
        hotel_id: record.raw_user_meta_data?.hotel_id || null,
        password_hash: 'handled_by_auth',
        needs_password_setup: false,
        email_verified: record.email_confirmed_at != null,
        can_manage_rooms: record.raw_user_meta_data?.role === 'admin',
        can_manage_staff: record.raw_user_meta_data?.role === 'admin'
      })

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }

    console.log('User profile created successfully for:', record.email)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in handle-auth-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
