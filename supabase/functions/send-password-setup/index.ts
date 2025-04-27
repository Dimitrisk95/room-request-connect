
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
    const { email, name } = await req.json()
    
    console.log('Sending password setup email to:', email)

    const { data, error } = await resend.emails.send({
      from: 'Roomlix <onboarding@resend.dev>',
      to: [email],
      subject: 'Set Up Your Roomlix Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Roomlix!</h1>
          <p>Hello ${name},</p>
          <p>Your account has been created in the Roomlix hotel management system. To complete your account setup, please set your password by clicking the link below:</p>
          <p style="margin: 24px 0;">
            <a href="https://${req.headers.get('host')}/login?email=${encodeURIComponent(email)}&setup=true" 
               style="background: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Set Up Your Password
            </a>
          </p>
          <p>If you didn't expect this invitation, please ignore this email.</p>
          <p>Best regards,<br>The Roomlix Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

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
