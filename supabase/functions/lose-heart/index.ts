import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseUser = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = user.id;

    // Get profile and compute effective hearts with auto-refill
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("hearts, hearts_updated_at")
      .eq("id", userId)
      .single();
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: corsHeaders });
    }

    // Compute effective hearts (auto-refill: 1 per 30 min, max 5)
    const elapsed = Date.now() - new Date(profile.hearts_updated_at ?? Date.now()).getTime();
    const refilled = Math.min(5, (profile.hearts ?? 0) + Math.floor(elapsed / (30 * 60 * 1000)));

    if (refilled <= 0) {
      return new Response(JSON.stringify({ error: "No hearts", hearts: 0 }), { status: 403, headers: corsHeaders });
    }

    const newHearts = refilled - 1;
    await supabaseAdmin.from("profiles").update({
      hearts: newHearts,
      hearts_updated_at: new Date().toISOString(),
    }).eq("id", userId);

    return new Response(JSON.stringify({ success: true, hearts: newHearts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
