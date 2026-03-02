import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, editorPassword, updates } = await req.json();

    if (!slug || !editorPassword || !updates) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find recipient and verify editor password
    const { data: recipient, error: fetchError } = await supabase
      .from("birthday_recipients")
      .select("id, editor_password_hash")
      .eq("slug", slug)
      .single();

    if (fetchError || !recipient) {
      return new Response(
        JSON.stringify({ success: false, error: "Recipient not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!recipient.editor_password_hash) {
      return new Response(
        JSON.stringify({ success: false, error: "Editor access not enabled" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const passwordHash = await hashPassword(editorPassword);
    if (passwordHash !== recipient.editor_password_hash) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid editor password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Whitelist allowed fields (prevent updating slug, passwords, etc.)
    const allowedFields = [
      "recipient_name", "birthday_date", "timezone",
      "profile_image_url", "voice_message_url", "background_music_url", "instagram_link",
      "countdown_title", "countdown_subtitle", "star_page_message",
      "cake_page_title", "cake_page_subtitle",
      "letter_title", "letter_paragraphs", "letter_signature", "sender_name",
      "final_reveal_message", "memories", "quiz_questions",
      "show_memory_timeline", "show_voice_message", "show_wish_vault",
      "show_final_reveal", "show_quiz",
    ];

    const safeUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        safeUpdates[key] = value;
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No valid fields to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabase
      .from("birthday_recipients")
      .update(safeUpdates)
      .eq("id", recipient.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
