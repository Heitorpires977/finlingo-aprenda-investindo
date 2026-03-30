import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { lessonId, mistakes } = await req.json();
    if (!lessonId || typeof lessonId !== "string") throw new Error("Invalid lessonId");
    if (typeof mistakes !== "number" || mistakes < 0) throw new Error("Invalid mistakes");

    // Validate lesson exists
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from("lessons")
      .select("id, xp_reward, section_id, lesson_number, is_quiz")
      .eq("id", lessonId)
      .single();
    if (lessonError || !lesson) throw new Error("Lesson not found");

    // Validate lesson is unlocked (user completed previous lesson)
    if (!(lesson.section_id === 1 && lesson.lesson_number === 1)) {
      // Check previous lesson in same section
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
          .eq("user_id", user.id)
          .eq("lesson_id", prevLesson.id)
          .eq("completed", true)
          .single();
        if (prevProgress) unlocked = true;
      }

      // First lesson of section: check last lesson of previous section
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
            .eq("user_id", user.id)
            .eq("lesson_id", prevSectionLessons[0].id)
            .eq("completed", true)
            .single();
          if (prevProgress) unlocked = true;
        }
      }

      if (!unlocked) throw new Error("Lesson locked");
    }

    // Get profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError || !profile) throw new Error("Profile not found");

    // Validate hearts: user must have had enough hearts for the mistakes
    if (profile.hearts < 0) throw new Error("No hearts");

    const perfect = mistakes === 0;
    const xpReward = (lesson.xp_reward ?? 10) + (perfect ? 5 : 0);

    // Check XP boost
    let multiplier = 1;
    if (profile.xp_boost_until && new Date(profile.xp_boost_until) > new Date()) {
      multiplier = 2;
    }
    const totalXp = xpReward * multiplier;

    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_lesson_date !== today;

    const updates: Record<string, unknown> = {
      xp_total: (profile.xp_total ?? 0) + totalXp,
      xp_weekly: (profile.xp_weekly ?? 0) + totalXp,
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
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        perfect,
        attempts: 1,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });

    // Update profile
    await supabaseAdmin.from("profiles").update(updates).eq("id", user.id);

    return new Response(JSON.stringify({ success: true, xpEarned: totalXp, perfect }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
