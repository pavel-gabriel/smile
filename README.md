# Smile

A tiny web app that shows **one uplifting phrase per day**, on a calm full-screen
background. Visitors come, read today's phrase, and smile. A single admin manages
the phrase queue and integrations.

Built to run entirely on free tiers ($0/month).

## How it works

- **Public page (`/`)** — shows today's phrase over an Unsplash background, with a
  gradient fallback. Server-rendered with ISR.
- **Daily rotation** — a Vercel Cron job hits `/api/cron/daily` at 00:00 UTC,
  picks the next phrase by queue position, caches its background, and (optionally)
  posts it to a Facebook page. Idempotent — safe to re-run.
- **Admin panel (`/admin`)** — Supabase-authenticated. Add phrases one at a time
  or via CSV bulk import, reorder/delete the queue, and configure Facebook posting.

## Stack

Next.js (App Router) · Vercel · Supabase (Postgres + Auth) · Unsplash API ·
Facebook Graph API. No SDKs beyond Supabase — external APIs are called with `fetch`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Unsplash keys
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm test        # unit tests (Node's built-in runner)
npm run lint
```

## Deployment

This app needs a host that runs Next.js server code (SSR + API route + cron) —
**GitHub Pages will not work** (it's static-only; see `DECISIONS.md` DEC-001).
Deploy to Vercel.

The full step-by-step — Supabase schema SQL, every environment variable, cron
setup, and post-deploy verification — lives in
[`docs/deployment.md`](docs/deployment.md).

## Project docs

| File | Purpose |
|------|---------|
| `PROJECT_BRIEF.md` | Goals, scope, constraints |
| `ARCHITECTURE.md` | System design, data model, infrastructure |
| `DECISIONS.md` | Key decisions and their rationale |
| `TASKS.md` | Task queue and status |
| `docs/deployment.md` | Deployment runbook |
