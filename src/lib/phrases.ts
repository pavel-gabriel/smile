import { supabaseAdmin } from "@/lib/supabase";

export type SelectionResult =
  | { status: "selected"; phraseId: string }
  | { status: "already_selected" }
  | { status: "error"; message: string };

// Picks the next unused phrase by queue_position and writes to daily_selections.
// Safe to call multiple times for the same date — idempotent.
export async function selectTodaysPhrase(): Promise<SelectionResult> {
  const today = new Date().toISOString().split("T")[0];

  // Already selected today → no-op
  const { data: existing } = await supabaseAdmin
    .from("daily_selections")
    .select("phrase_id")
    .eq("date", today)
    .single();

  if (existing) return { status: "already_selected" };

  // Next unused phrase ordered by queue position
  const { data: phrase, error: pickError } = await supabaseAdmin
    .from("phrases")
    .select("id")
    .is("used_at", null)
    .order("queue_position", { ascending: true })
    .limit(1)
    .single();

  if (pickError || !phrase) {
    return { status: "error", message: "No unused phrases available" };
  }

  // Write daily selection — unique constraint on date prevents duplicates
  const { error: insertError } = await supabaseAdmin
    .from("daily_selections")
    .insert({ date: today, phrase_id: phrase.id });

  if (insertError) {
    // Unique constraint violation = another request got there first
    if (insertError.code === "23505") return { status: "already_selected" };
    return { status: "error", message: insertError.message };
  }

  // Mark phrase as used
  await supabaseAdmin
    .from("phrases")
    .update({ used_at: new Date().toISOString() })
    .eq("id", phrase.id);

  return { status: "selected", phraseId: phrase.id };
}
