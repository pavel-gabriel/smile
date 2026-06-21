# Decisions

> Significant decisions only. Format: context → decision → rationale → consequences.

---

### DEC-001 — Next.js on Vercel
**Date:** 2026-04-13 | **Status:** Accepted

Needed full-stack (SSR + API + cron) at zero cost. GitHub Pages is static-only (no server code). Vercel is Next.js's native host — free tier includes serverless functions with external network calls and 1 cron job. Chosen over Remix/SvelteKit due to tighter Vercel integration.

**Consequences:** Tied to Vercel free tier limits (100GB bandwidth, 100k invocations/month — fine for low traffic).

---

### DEC-002 — Supabase for DB + Auth
**Date:** 2026-04-13 | **Status:** Accepted

Needed persistent store + admin auth in one free service. Firebase ruled out: Cloud Functions on Spark plan block outbound network calls (breaks Unsplash + Facebook integrations). Supabase free tier: 500MB Postgres + Auth. SQL is better than Firestore for ordered phrase queue.

**Consequences:** Project pauses after 7d inactivity (any visit wakes it). Manual DB management via Supabase dashboard.

---

### DEC-003 — Unsplash API for backgrounds (not AI generation)
**Date:** 2026-04-13 | **Status:** Accepted

AI image generation (Replicate, DALL·E) costs money per image. Unsplash is free, high-quality, keyword-searchable. Rate limit (50 req/h) is irrelevant since URL is cached in DB after first fetch — Unsplash called once per phrase ever. Unsplash attribution required on public page.

**Consequences:** Photos, not illustrations. AI upgrade path preserved — only `src/lib/unsplash.ts` needs changing.

---

### DEC-004 — Queue + Vercel Cron for daily phrase selection
**Date:** 2026-04-13 | **Status:** Accepted

Alternative: date-index (`days_since_epoch % count`). Rejected — adding/removing phrases silently remaps all past dates. Queue approach: admin controls order, `daily_selections` is an explicit audit log, cron provides the Facebook post hook. Cron fires 00:00 UTC, writes to `daily_selections` (idempotent).

**Consequences:** If cron fails, previous day's phrase persists until next run or manual trigger.

---

### DEC-005 — Facebook token management: manual v1
**Date:** 2026-04-13 | **Status:** Accepted

Long-lived page tokens expire ~60d. Auto-refresh requires OAuth callback + scheduled refresh job — too complex for v1. Admin refreshes manually in settings panel. Facebook failure is logged but never blocks phrase rotation.

**Consequences:** Admin must refresh token every ~60 days. Auto-refresh is a backlog item.

---

### DEC-006 — Unsplash & Facebook via `fetch`, not SDKs
**Date:** 2026-06-21 | **Status:** Accepted

`ARCHITECTURE.md` listed an "Unsplash JS SDK" and a Facebook client. Both
integrations are a single HTTP call each, so they were implemented with the
built-in `fetch` (`src/lib/unsplash.ts`, `src/lib/facebook.ts`) rather than
adding npm dependencies. Keeps the dependency surface minimal and consistent.

**Consequences:** No SDK conveniences (typed responses, retries). Each client
returns a tagged result and never throws, so callers degrade gracefully.

---

### DEC-007 — Backgrounds fetched at selection time, not first visitor render
**Date:** 2026-06-21 | **Status:** Accepted

The architecture sketched fetching the Unsplash background lazily on the first
visitor render. Instead, the background is fetched and cached when a phrase is
chosen for the day inside `selectTodaysPhrase` (cron path). This avoids an
Unsplash call during the ISR-cached public render and guarantees the URL is
ready before traffic arrives. The public page keeps the gradient fallback for
any phrase whose `background_url` is still null.

**Consequences:** If the cron-time fetch fails, the day shows the gradient
fallback rather than retrying on visit. Acceptable for v1.

---

### DEC-008 — Tests via Node's built-in runner
**Date:** 2026-06-21 | **Status:** Accepted

`npm test` runs `node --test` over `tests/**/*.test.ts` using Node 22's native
type stripping — no Jest/Vitest dependency. Suits the current need (pure-logic
unit tests, e.g. CSV parsing). Integration paths that need a live DB / external
APIs are covered by `next build` + typecheck for now.

**Consequences:** Limited to runtime-strippable TS and no rich mocking. Revisit
if integration/e2e coverage becomes necessary.
