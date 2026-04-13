import { supabaseAdmin } from "@/lib/supabase";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: rows } = await supabaseAdmin.from("settings").select("key, value");

  const s = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]));

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold">Settings</h1>

      <form action={saveSettings} className="space-y-6">
        {/* Facebook */}
        <fieldset className="space-y-3 rounded-xl border border-neutral-800 p-5">
          <legend className="px-1 text-sm font-medium text-neutral-300">
            Facebook
          </legend>

          <div className="space-y-1">
            <label className="text-xs text-neutral-500">Page ID</label>
            <input
              name="facebook_page_id"
              type="text"
              defaultValue={s.facebook_page_id ?? ""}
              placeholder="e.g. 123456789"
              className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-500">
              Page Access Token{" "}
              <span className="text-neutral-600">(expires ~60 days)</span>
            </label>
            <input
              name="facebook_access_token"
              type="password"
              defaultValue={s.facebook_access_token ?? ""}
              placeholder="Paste token…"
              className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              name="posting_enabled"
              type="checkbox"
              defaultChecked={s.posting_enabled === "true"}
              className="h-4 w-4 rounded accent-white"
            />
            <span className="text-sm">Auto-post daily phrase to Facebook</span>
          </label>
        </fieldset>

        {/* General */}
        <fieldset className="space-y-3 rounded-xl border border-neutral-800 p-5">
          <legend className="px-1 text-sm font-medium text-neutral-300">
            General
          </legend>

          <div className="space-y-1">
            <label className="text-xs text-neutral-500">
              Timezone for midnight reset
            </label>
            <input
              name="timezone"
              type="text"
              defaultValue={s.timezone ?? "UTC"}
              placeholder="UTC"
              className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:ring-2 focus:ring-white/20"
            />
            <p className="text-xs text-neutral-600">
              Note: cron fires at 00:00 UTC in v1. This field is stored for future use.
            </p>
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
