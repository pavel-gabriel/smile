import { supabaseAdmin } from "@/lib/supabase";

// Facebook page posting via the Graph API (fetch only — no SDK, see DEC-005).
// Credentials and the posting toggle live in the `settings` table (managed in
// the admin panel), with env vars as a fallback for local/dev use.

const GRAPH_VERSION = "v21.0";

export type FacebookPostResult =
  | { status: "posted"; postId: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

async function loadSettings(): Promise<Record<string, string>> {
  const { data } = await supabaseAdmin.from("settings").select("key, value");
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
}

// Posts a message to the configured Facebook page. Never throws — returns a
// tagged result so the caller (cron) can log without blocking phrase rotation.
export async function postToFacebook(message: string): Promise<FacebookPostResult> {
  const settings = await loadSettings();

  const postingEnabled =
    (settings.posting_enabled ?? "false") === "true";
  if (!postingEnabled) {
    return { status: "skipped", reason: "posting disabled" };
  }

  const pageId = settings.facebook_page_id || process.env.FACEBOOK_PAGE_ID;
  const token =
    settings.facebook_access_token || process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pageId || !token) {
    return { status: "skipped", reason: "missing page id or access token" };
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, access_token: token }),
      cache: "no-store",
    });

    const data = (await res.json()) as {
      id?: string;
      error?: { message?: string };
    };

    if (!res.ok || data.error) {
      return {
        status: "error",
        message: data.error?.message ?? `HTTP ${res.status}`,
      };
    }

    return { status: "posted", postId: data.id ?? "" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "unknown error",
    };
  }
}

// Builds the post text from a phrase.
export function formatPhraseForPost(text: string, author: string | null): string {
  return author ? `"${text}"\n\n— ${author}` : `"${text}"`;
}
