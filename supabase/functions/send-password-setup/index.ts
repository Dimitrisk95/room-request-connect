
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

  try {
    const { email, name, hotelName } = await req.json()
    
    console.log('Sending welcome email with password setup link to:', email)
    
    // Get the authenticated user's email to use as the sender (hotel admin)
    let fromEmail = 'support@roomlix.com' // Default sender email
    let senderName = 'Roomlix Support'
    
    // Create a Supabase client within the edge function
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.user_metadata?.name) {
          senderName = payload.user_metadata.name
        }
      } catch (e) {
        console.error('Error parsing auth token:', e)
      }
    }

    const { data, error } = await resend.emails.send({
      from: `${senderName} via Roomlix <${fromEmail}>`,
      to: [email],
      subject: 'Welcome to Roomlix - Set Up Your Staff Account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to the Team!</h1>
          <p>Hello ${name},</p>
          ${hotelName ? `<p>You have been added as a staff member at <strong>${hotelName}</strong>.</p>` : ''}
          <p>To complete your account setup and start using Roomlix, please click the link below to set your password:</p>
          <p style="margin: 24px 0;">
            <a href="https://${req.headers.get('host')}/login?email=${encodeURIComponent(email)}&setup=true" 
               style="background: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Set Up Your Password
            </a>
          </p>
          <p>If you have any questions, please contact your administrator.</p>
          <p>Best regards,<br>The Roomlix Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      throw error
    }

    console.log('Welcome email sent successfully:', data)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in send-password-setup function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
