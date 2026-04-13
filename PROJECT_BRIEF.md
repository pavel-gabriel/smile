# Project Brief — Smile

**What:** Web app showing one uplifting phrase per day. Visitors smile. Admin manages content.
**Budget:** $0/month (free tiers only)
**Owner:** Solo project, one admin

## Stack
Next.js (App Router) · Vercel · Supabase (Postgres + Auth) · Unsplash API · Facebook Graph API

## Scope — In
- One phrase/day, auto-rotates at midnight (UTC)
- Background image per phrase via Unsplash keyword search (URL cached in DB)
- Admin panel: phrase list, single-add (text box), CSV bulk import, settings
- Facebook page auto-post on phrase change (via Vercel Cron)

## Scope — Out
- User accounts, comments, social features on site
- AI-generated images (backlog)
- Mobile app (v2)
- Multi-language

## Users
| Type | Need |
|------|------|
| Visitor | See today's phrase + background |
| Admin | Manage phrases, configure Facebook, monitor stock |

## Risks
| Risk | Mitigation |
|------|-----------|
| Unsplash rate limit (50 req/h) | Cache URL in DB — 1 call per phrase ever |
| Facebook token expiry (~60d) | Manual refresh in settings panel |
| Phrase bank depletion | Low-stock warning (backlog) |
| Supabase free tier pauses after 7d inactivity | Any visit wakes it; acceptable for v1 |
