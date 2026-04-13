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
