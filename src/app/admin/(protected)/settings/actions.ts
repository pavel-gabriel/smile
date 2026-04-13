"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export async function saveSettings(formData: FormData) {
  const entries = [
    { key: "facebook_page_id", value: (formData.get("facebook_page_id") as string) ?? "" },
    { key: "facebook_access_token", value: (formData.get("facebook_access_token") as string) ?? "" },
    { key: "posting_enabled", value: formData.get("posting_enabled") === "on" ? "true" : "false" },
    { key: "timezone", value: (formData.get("timezone") as string) || "UTC" },
  ];

  await supabaseAdmin.from("settings").upsert(
    entries.map((e) => ({ ...e, updated_at: new Date().toISOString() })),
    { onConflict: "key" }
  );

  revalidatePath("/admin/settings");
}
