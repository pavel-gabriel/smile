// Unsplash background fetching. We hit the REST API directly with fetch to
// avoid adding an SDK dependency (see DEC-003). The result URL is cached in
// the DB by the caller, so Unsplash is called at most once per phrase.

const DEFAULT_QUERY = "calm nature landscape";

// Returns a regular-size photo URL for the given keywords, or null on any
// failure (missing key, rate limit, network, no results). Callers must treat
// null as "use the gradient fallback" — this never throws.
export async function fetchBackgroundUrl(
  keywords?: string[] | null
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("[unsplash] UNSPLASH_ACCESS_KEY not set — skipping background");
    return null;
  }

  const query =
    keywords && keywords.length > 0 ? keywords.join(" ") : DEFAULT_QUERY;

  // /photos/random with a query returns a random matching photo, which keeps
  // backgrounds visually distinct from one phrase to the next.
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
    query
  )}&orientation=landscape&content_filter=high`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      // Backgrounds are immutable once chosen; no need to cache the API call.
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[unsplash] request failed", res.status);
      return null;
    }

    const data = (await res.json()) as { urls?: { regular?: string } };
    return data.urls?.regular ?? null;
  } catch (err) {
    console.error("[unsplash] fetch error", err);
    return null;
  }
}
