import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOP_ITEMS: Record<string, { price: number }> = {
  heart_refill: { price: 10 },
  xp_boost: { price: 50 },
  streak_freeze: { price: 20 },
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

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { itemType } = await req.json();
    const item = SHOP_ITEMS[itemType];
    if (!item) throw new Error("Invalid item");

    // Get profile with server-side balance check
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("fincoins, hearts, xp_boost_until")
      .eq("id", user.id)
      .single();
    if (!profile) throw new Error("Profile not found");

    if ((profile.fincoins ?? 0) < item.price) throw new Error("Insufficient FinCoins");

    const updates: Record<string, unknown> = {
      fincoins: (profile.fincoins ?? 0) - item.price,
    };

    if (itemType === "heart_refill") {
      updates.hearts = 5;
    } else if (itemType === "xp_boost") {
      updates.xp_boost_until = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    }

    // Record transaction
    await supabaseAdmin.from("transactions").insert({
      user_id: user.id,
      item_type: itemType,
      fincoins_spent: item.price,
    });

    // Apply effects
    await supabaseAdmin.from("profiles").update(updates).eq("id", user.id);

    if (itemType === "streak_freeze") {
      await supabaseAdmin.from("streak_freezes").insert({ user_id: user.id });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
