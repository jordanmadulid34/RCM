// Supabase Edge Function: send-admin-email
// Accepts a POST request with JSON body: { recipient, subject, message, recordId, recordTable }
// Sends email via Resend API and logs attempts to email_logs table.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 4. Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Accept POST request with JSON body: { recipient, subject, message, recordId, recordTable }
    const body = await req.json();

    const recipient = body.recipient || body.recipientEmail;
    const subject = body.subject;
    const message = body.message;
    const recordId = body.recordId || body.relatedRecordId || null;
    const recordTable = body.recordTable || body.relatedTableName || null;
    const recipientName = body.recipientName || null;
    const adminEmail = body.adminEmail || "admin@rotaryclubmakati.org";

    if (!recipient || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields: recipient, subject, or message",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 2. Read Resend API key from environment variable RESEND_API_KEY
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "RESEND_API_KEY environment variable is not configured in secrets.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Format HTML email message
    const formattedHtml = message.includes("<p>") || message.includes("<div")
      ? message
      : `<p>${message.replace(/\n/g, "<br/>")}</p>`;

    // 3. Send email via Resend API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rotary Club of Makati <onboarding@resend.dev>",
        to: [recipient],
        subject: subject,
        html: formattedHtml,
      }),
    });

    const resendData = await resendRes.json();
    let isSuccess = resendRes.ok;
    let errorMessage: string | null = null;
    let responseMessage = "Email sent successfully";

    if (!isSuccess) {
      console.error("[send-admin-email] Resend API Error Status:", resendRes.status);
      console.error("[send-admin-email] Resend API Full Raw Response:", JSON.stringify(resendData, null, 2));

      const rawErrorStr = JSON.stringify(resendData);
      const detailMsg = resendData.message || resendData.error || rawErrorStr;

      // Catch Resend test mode restriction specifically or return exact raw detail
      if (
        resendRes.status === 403 ||
        rawErrorStr.toLowerCase().includes("can only send to your") ||
        rawErrorStr.toLowerCase().includes("validation_error")
      ) {
        errorMessage = `Test mode: can only send to your verified Resend email. (Raw Resend error: ${detailMsg})`;
        responseMessage = `Test mode: can only send to your verified Resend email. Details: ${detailMsg}`;
      } else {
        errorMessage = typeof detailMsg === "string" ? detailMsg : JSON.stringify(detailMsg);
        responseMessage = `Resend API Error (${resendRes.status}): ${errorMessage}`;
      }
    }

    // 6. Insert row into email_logs on every attempt (success or failure)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        await supabaseAdmin.from("email_logs").insert([
          {
            recipient: recipient,
            recipient_email: recipient,
            recipient_name: recipientName,
            subject: subject,
            message: message,
            record_id: recordId ? String(recordId) : null,
            related_record_id: recordId ? String(recordId) : null,
            record_table: recordTable,
            related_table_name: recordTable,
            admin_email: adminEmail,
            status: isSuccess ? "success" : "failed",
            error_message: errorMessage,
            sent_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.error("Failed to insert row into email_logs:", dbErr);
      }
    }

    // 7. Return JSON response: { success: true/false, message: string }
    if (!isSuccess) {
      return new Response(
        JSON.stringify({
          success: false,
          message: responseMessage,
          resendError: resendData,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: responseMessage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message || "Internal Edge Function Error",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

