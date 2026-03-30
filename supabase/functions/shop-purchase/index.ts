import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHOP_ITEMS: Record<string, { price: number }> = {
  heart_refill: { price: 10 },
  xp_boost: { price: 50 },
  streak_freeze: { price: 20 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseUser = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const itemType = typeof body.itemType === "string" ? body.itemType.trim() : null;
    const item = itemType ? SHOP_ITEMS[itemType] : null;
    if (!item) {
      return new Response(JSON.stringify({ error: "Invalid item" }), { status: 400, headers: corsHeaders });
    }

    // Server-side balance check
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("fincoins, hearts, xp_boost_until")
      .eq("id", userId)
      .single();
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: corsHeaders });
    }

    if ((profile.fincoins ?? 0) < item.price) {
      return new Response(JSON.stringify({ error: "Insufficient FinCoins" }), { status: 403, headers: corsHeaders });
    }

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
      user_id: userId,
      item_type: itemType,
      fincoins_spent: item.price,
    });

    // Apply effects
    await supabaseAdmin.from("profiles").update(updates).eq("id", userId);

    if (itemType === "streak_freeze") {
      await supabaseAdmin.from("streak_freezes").insert({ user_id: userId });
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
