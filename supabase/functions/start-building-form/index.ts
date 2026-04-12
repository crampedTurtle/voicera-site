import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Recipient stored server-side only — not exposed to frontend
const NOTIFICATION_RECIPIENT = "brett@voicera.io";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, jobTitle, businessEmail, companyName, companyWebsite, useCase } = body;

    // Validate required fields
    if (!firstName || !lastName || !jobTitle || !businessEmail || !companyName || !useCase) {
      return new Response(
        JSON.stringify({ error: "All required fields must be filled." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Store submission in database
    const { error: dbError } = await supabase.from("start_building_submissions").insert({
      first_name: firstName.trim().slice(0, 100),
      last_name: lastName.trim().slice(0, 100),
      job_title: jobTitle.trim().slice(0, 150),
      business_email: businessEmail.trim().slice(0, 255),
      company_name: companyName.trim().slice(0, 200),
      company_website: companyWebsite?.trim().slice(0, 500) || null,
      use_case: useCase.trim().slice(0, 2000),
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to submit request." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log notification for email delivery
    console.log(
      `New API Key Request from ${firstName} ${lastName} (${businessEmail}) at ${companyName}. ` +
      `Notification to: ${NOTIFICATION_RECIPIENT}`
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Start building form error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
