
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
    
    console.log('Sending password reset email to:', email)

    // Get the authenticated user's email to use as the sender
    let fromEmail = 'support@roomlix.com' // Default sender email
    let senderName = 'Roomlix Support'
    
    // Create a Supabase client within the edge function
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.email) {
          // Add sender name if available
          if (payload.user_metadata?.name) {
            senderName = payload.user_metadata.name
          }
        }
      } catch (e) {
        console.error('Error parsing auth token:', e)
      }
    }

    // Use a hardcoded frontend URL instead of relying on the request host
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://roomlix.com'
    
    const { data, error } = await resend.emails.send({
      from: `${senderName} via Roomlix <${fromEmail}>`,
      to: [email],
      subject: 'Reset Your Roomlix Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Reset Your Password</h1>
          <p>Hello ${name},</p>
          ${hotelName ? `<p>This password reset was requested for your account at <strong>${hotelName}</strong>.</p>` : ''}
          <p>To reset your password, please click the link below:</p>
          <p style="margin: 24px 0;">
            <a href="${frontendUrl}/login?email=${encodeURIComponent(email)}&reset=true" 
               style="background: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Your Password
            </a>
          </p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The Roomlix Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending reset password email:', error)
      throw error
    }

    console.log('Reset password email sent successfully:', data)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in reset-password-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
