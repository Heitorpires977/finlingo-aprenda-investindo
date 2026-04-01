import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GUIDE_READ_XP = 5;

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

    const body = await req.json();
    const guideId = typeof body.guideId === "string" ? body.guideId.trim() : null;
    if (!guideId) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: corsHeaders });
    }

    // Validate guide exists
    const { data: guide, error: guideError } = await supabaseAdmin
      .from("technical_guides")
      .select("id, lesson_id")
      .eq("id", guideId)
      .single();
    if (guideError || !guide) {
      return new Response(JSON.stringify({ error: "Guide not found" }), { status: 404, headers: corsHeaders });
    }

    // Validate lesson is completed (security: can't mark unearned guides)
    const { data: lessonProgress } = await supabaseAdmin
      .from("user_lesson_progress")
      .select("completed")
      .eq("user_id", userId)
      .eq("lesson_id", guide.lesson_id)
      .eq("completed", true)
      .single();
    if (!lessonProgress) {
      return new Response(JSON.stringify({ error: "Lesson not completed" }), { status: 403, headers: corsHeaders });
    }

    // Idempotency: already read?
    const { data: existing } = await supabaseAdmin
      .from("user_guide_reads")
      .select("id")
      .eq("user_id", userId)
      .eq("guide_id", guideId)
      .single();
    if (existing) {
      return new Response(JSON.stringify({ success: true, xpEarned: 0, alreadyRead: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record the read
    await supabaseAdmin.from("user_guide_reads").insert({
      user_id: userId,
      guide_id: guideId,
    });

    // Award XP bonus
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("xp_total, xp_weekly")
      .eq("id", userId)
      .single();

    await supabaseAdmin.from("profiles").update({
      xp_total: (profile?.xp_total ?? 0) + GUIDE_READ_XP,
      xp_weekly: (profile?.xp_weekly ?? 0) + GUIDE_READ_XP,
    }).eq("id", userId);

    // Check for 'Estudioso' badge
    let badgeEarned = false;
    const { data: allReads } = await supabaseAdmin
      .from("user_guide_reads")
      .select("id")
      .eq("user_id", userId);
    const { data: totalGuides } = await supabaseAdmin
      .from("technical_guides")
      .select("id");

    if (allReads && totalGuides && allReads.length >= totalGuides.length && totalGuides.length > 0) {
      // Find the badge
      const { data: badge } = await supabaseAdmin
        .from("badges")
        .select("id")
        .eq("criteria_type", "guides_read")
        .single();
      if (badge) {
        const { data: existingBadge } = await supabaseAdmin
          .from("user_badges")
          .select("id")
          .eq("user_id", userId)
          .eq("badge_id", badge.id)
          .single();
        if (!existingBadge) {
          await supabaseAdmin.from("user_badges").insert({
            user_id: userId,
            badge_id: badge.id,
          });
          badgeEarned = true;
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      xpEarned: GUIDE_READ_XP,
      badgeEarned,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
