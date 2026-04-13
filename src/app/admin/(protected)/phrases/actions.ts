"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export async function addPhrase(formData: FormData) {
  const text = (formData.get("text") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || null;

  if (!text) return;

  // Append at end of queue
  const { data: last } = await supabaseAdmin
    .from("phrases")
    .select("queue_position")
    .order("queue_position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (last?.queue_position ?? 0) + 1;

  await supabaseAdmin.from("phrases").insert({
    text,
    author,
    queue_position: nextPosition,
  });

  revalidatePath("/admin/phrases");
}

export async function deletePhrase(phraseId: string) {
  await supabaseAdmin.from("phrases").delete().eq("id", phraseId);
  revalidatePath("/admin/phrases");
}

export async function movePhraseUp(phraseId: string) {
  const { data: phrases } = await supabaseAdmin
    .from("phrases")
    .select("id, queue_position")
    .is("used_at", null)
    .order("queue_position", { ascending: true });

  if (!phrases) return;

  const idx = phrases.findIndex((p) => p.id === phraseId);
  if (idx <= 0) return;

  const above = phrases[idx - 1];
  const current = phrases[idx];

  await supabaseAdmin
    .from("phrases")
    .update({ queue_position: above.queue_position })
    .eq("id", current.id);
  await supabaseAdmin
    .from("phrases")
    .update({ queue_position: current.queue_position })
    .eq("id", above.id);

  revalidatePath("/admin/phrases");
}

export async function movePhraseDown(phraseId: string) {
  const { data: phrases } = await supabaseAdmin
    .from("phrases")
    .select("id, queue_position")
    .is("used_at", null)
    .order("queue_position", { ascending: true });

  if (!phrases) return;

  const idx = phrases.findIndex((p) => p.id === phraseId);
  if (idx === -1 || idx >= phrases.length - 1) return;

  const below = phrases[idx + 1];
  const current = phrases[idx];

  await supabaseAdmin
    .from("phrases")
    .update({ queue_position: below.queue_position })
    .eq("id", current.id);
  await supabaseAdmin
    .from("phrases")
    .update({ queue_position: current.queue_position })
    .eq("id", below.id);

  revalidatePath("/admin/phrases");
}
