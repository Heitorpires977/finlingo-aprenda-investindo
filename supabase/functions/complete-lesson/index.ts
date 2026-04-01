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

    // Validate input
    const body = await req.json();
    const lessonId = typeof body.lessonId === "string" ? body.lessonId.trim() : null;
    const mistakes = typeof body.mistakes === "number" ? Math.max(0, Math.floor(body.mistakes)) : null;
    if (!lessonId || mistakes === null) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: corsHeaders });
    }

    // Idempotency: check if lesson already completed
    const { data: existingProgress } = await supabaseAdmin
      .from("user_lesson_progress")
      .select("completed")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .eq("completed", true)
      .single();
    if (existingProgress) {
      return new Response(JSON.stringify({ success: true, xpEarned: 0, perfect: false, alreadyCompleted: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate lesson exists
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from("lessons")
      .select("id, xp_reward, section_id, lesson_number, is_quiz")
      .eq("id", lessonId)
      .single();
    if (lessonError || !lesson) {
      return new Response(JSON.stringify({ error: "Lesson not found" }), { status: 404, headers: corsHeaders });
    }

    // Validate lesson is unlocked
    if (!(lesson.section_id === 1 && lesson.lesson_number === 1)) {
      const { data: prevLesson } = await supabaseAdmin
        .from("lessons")
        .select("id")
        .eq("section_id", lesson.section_id)
        .eq("lesson_number", lesson.lesson_number - 1)
        .single();

      let unlocked = false;
      if (prevLesson) {
        const { data: prevProgress } = await supabaseAdmin
          .from("user_lesson_progress")
          .select("completed")
          .eq("user_id", userId)
          .eq("lesson_id", prevLesson.id)
          .eq("completed", true)
          .single();
        if (prevProgress) unlocked = true;
      }

      if (!unlocked && lesson.lesson_number === 1 && lesson.section_id > 1) {
        const { data: prevSectionLessons } = await supabaseAdmin
          .from("lessons")
          .select("id")
          .eq("section_id", lesson.section_id - 1)
          .order("lesson_number", { ascending: false })
          .limit(1);
        if (prevSectionLessons?.[0]) {
          const { data: prevProgress } = await supabaseAdmin
            .from("user_lesson_progress")
            .select("completed")
            .eq("user_id", userId)
            .eq("lesson_id", prevSectionLessons[0].id)
            .eq("completed", true)
            .single();
          if (prevProgress) unlocked = true;
        }
      }

      if (!unlocked) {
        return new Response(JSON.stringify({ error: "Lesson locked" }), { status: 403, headers: corsHeaders });
      }
    }

    // Get profile and compute effective hearts with auto-refill
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: corsHeaders });
    }

    // Compute effective hearts
    const elapsed = Date.now() - new Date(profile.hearts_updated_at ?? Date.now()).getTime();
    const effectiveHearts = Math.min(5, (profile.hearts ?? 0) + Math.floor(elapsed / (30 * 60 * 1000)));

    if (effectiveHearts <= 0) {
      return new Response(JSON.stringify({ error: "No hearts" }), { status: 403, headers: corsHeaders });
    }

    const XP_TO_COIN_RATIO = 50;

    const perfect = mistakes === 0;
    const xpReward = (lesson.xp_reward ?? 10) + (perfect ? 5 : 0);

    let multiplier = 1;
    if (profile.xp_boost_until && new Date(profile.xp_boost_until) > new Date()) {
      multiplier = 2;
    }
    const totalXp = xpReward * multiplier;
    const coinsEarned = Math.floor(totalXp / XP_TO_COIN_RATIO);

    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_lesson_date !== today;

    const updates: Record<string, unknown> = {
      xp_total: (profile.xp_total ?? 0) + totalXp,
      xp_weekly: (profile.xp_weekly ?? 0) + totalXp,
      fincoins: (profile.fincoins ?? 0) + coinsEarned,
      last_lesson_date: today,
    };

    if (isNewDay) {
      const newStreak = (profile.streak_current ?? 0) + 1;
      updates.streak_current = newStreak;
      if (newStreak > (profile.streak_longest ?? 0)) {
        updates.streak_longest = newStreak;
      }
    }

    // Upsert lesson progress
    await supabaseAdmin
      .from("user_lesson_progress")
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        perfect,
        attempts: 1,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });

    // Update profile
    await supabaseAdmin.from("profiles").update(updates).eq("id", userId);

    return new Response(JSON.stringify({ success: true, xpEarned: totalXp, coinsEarned, perfect }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
