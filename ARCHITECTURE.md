# Architecture — Smile

## Diagram
```
Visitor/Admin ──▶ Vercel (Next.js App Router)
                      ├── / (public, ISR)
                      ├── /admin (Supabase Auth)
                      └── /api/*
                              ├──▶ Supabase (Postgres + Auth)
                              ├──▶ Unsplash API (backgrounds)
                              └──▶ Facebook Graph API (daily post)
Vercel Cron (00:00 UTC) ──▶ /api/cron/daily
```

## Components
| Component | Tech | Path |
|-----------|------|------|
| Public page | Next.js server component, ISR | `src/app/page.tsx` |
| Admin panel | Next.js + Supabase Auth | `src/app/admin/` |
| Phrase API | Next.js API route | `src/app/api/phrase/` |
| Admin API | Next.js API routes | `src/app/api/admin/` |
| Cron handler | Next.js API route | `src/app/api/cron/daily/` |
| DB client | Supabase JS | `src/lib/supabase.ts` |
| Unsplash client | Unsplash JS SDK | `src/lib/unsplash.ts` |
| Facebook client | fetch + Graph API | `src/lib/facebook.ts` |

## Data Model
```
phrases           id uuid PK, text, author?, keywords text[], background_url?, queue_position int, used_at timestamp?, created_at
daily_selections  id uuid PK, date date UNIQUE, phrase_id uuid FK, created_at
settings          key text PK, value text, updated_at
```

Settings keys: `facebook_page_id`, `facebook_access_token`, `posting_enabled`, `timezone`

## Key Flows

**Visitor loads page**
1. Next.js fetches today's row from `daily_selections` → joins `phrases`
2. If `background_url` is null → Unsplash query by keywords → cache URL in DB
3. Render phrase + background; ISR revalidates at midnight

**Cron fires (00:00 UTC)**
1. Pick next phrase by `queue_position` where `used_at` is null
2. Insert into `daily_selections` (idempotent — skip if date exists)
3. Call Facebook Graph API to post; log errors, do not block

**Admin adds phrases**
- Single: form → `POST /api/admin/phrases`
- Bulk: CSV parsed client-side → `POST /api/admin/phrases/bulk`

## Auth
- Visitors: no auth
- Admin: Supabase Auth (email/password, single user)
- Cron endpoint: `Authorization: Bearer $CRON_SECRET` header

## Infrastructure
| Resource | Provider | Notes |
|----------|----------|-------|
| Hosting + Functions | Vercel free | Serverless, external calls allowed |
| Database + Auth | Supabase free | 500MB, pauses after 7d inactivity |
| Backgrounds | Unsplash free | 50 req/h; mitigated by DB cache |
| Cron | Vercel free | 1 job — `vercel.json` |
| Secrets | Vercel env vars | |

## Limitations
- Midnight reset is UTC only (v1)
- Facebook token expires ~60d — manual refresh required
- Supabase project pauses after 7 days with no traffic
