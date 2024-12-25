import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  to?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactRequest: ContactRequest = await req.json();

    // Log the incoming request for debugging
    console.log("Received contact request:", contactRequest);

    // Determine if this is a new contact message or a reply
    const isReply = Array.isArray(contactRequest.to);
    const emailConfig = isReply
      ? {
          from: "SX Tour Douai <contact.sxtour.douai@gmail.com>",
          to: contactRequest.to,
          reply_to: "contact.sxtour.douai@gmail.com",
          subject: contactRequest.subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <p>Bonjour ${contactRequest.name},</p>
              <p>${contactRequest.message}</p>
              <p>Cordialement,<br>L'équipe SX Tour Douai</p>
            </div>
          `,
        }
      : {
          from: "SX Tour Douai <contact.sxtour.douai@gmail.com>",
          to: ["contact.sxtour.douai@gmail.com"],
          reply_to: contactRequest.email,
          subject: `Nouveau message de contact - ${contactRequest.subject}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${contactRequest.name}</p>
            <p><strong>Email:</strong> ${contactRequest.email}</p>
            <p><strong>Sujet:</strong> ${contactRequest.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${contactRequest.message}</p>
          `,
        };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailConfig),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error response from Resend:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: `Failed to send email: ${error}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);