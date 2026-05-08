import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { record, type } = await req.json();

    // Only act on INSERT events
    if (type !== "INSERT" || !record) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const tier = record.tier || "free";
    let priority: string;
    let leadScore: number;

    // Classify lead based on tier
    if (tier === "full" || tier === "monitoring") {
      priority = "hot";
      leadScore = tier === "full" ? 90 : 70;
    } else {
      priority = "warm";
      leadScore = 40;
    }

    // Update the lead record with classification
    const { error } = await supabase
      .from("client_forms")
      .update({
        priority,
        status: "new",
        lead_score: leadScore,
        email_stage: 0,
        classified_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    if (error) {
      console.error("Classification update failed:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log(`Lead ${record.id} classified: tier=${tier}, priority=${priority}, score=${leadScore}`);

    return new Response(
      JSON.stringify({ success: true, id: record.id, priority, leadScore }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});