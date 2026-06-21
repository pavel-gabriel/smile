import { supabaseAdmin } from "@/lib/supabase";
import { fetchBackgroundUrl } from "@/lib/unsplash";

export type SelectionResult =
  | { status: "selected"; phraseId: string; text: string; author: string | null }
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
    .select("id, text, author, keywords, background_url")
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

  // Cache a background image if this phrase doesn't have one yet. Failure here
  // must never block phrase rotation, so it's best-effort.
  if (!phrase.background_url) {
    const url = await fetchBackgroundUrl(phrase.keywords);
    if (url) {
      await supabaseAdmin
        .from("phrases")
        .update({ background_url: url })
        .eq("id", phrase.id);
    }
  }

  return {
    status: "selected",
    phraseId: phrase.id,
    text: phrase.text,
    author: phrase.author ?? null,
  };
}
