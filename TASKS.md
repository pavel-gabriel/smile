# Tasks

> Priority order top to bottom. `[~]` = in progress, `[x]` = done.
> Add discovered tasks to Backlog. Mark done with date.

---

## In Progress
_none_

## Queue

- [x] [setup] Init Next.js + TypeScript + Tailwind
  - Done when: `next dev` runs, TS compiles, Tailwind works

- [x] [setup] Supabase schema + client wiring
  - Done when: 3 tables exist, client queries from local dev, `.env.example` documented

- [x] [feat] Public phrase display page (`/`)
  - Done when: today's phrase + background renders; fallback shown if no phrase; ISR revalidates at midnight

- [x] [feat] Daily phrase selection logic
  - Done when: phrase advances each day by queue position; same phrase all day; idempotent re-runs

- [x] [feat] Admin auth (`/admin/login`)
  - Done when: login/logout work; unauthenticated requests redirected

- [x] [feat] Admin — phrase list + delete + reorder
  - Done when: all phrases listed; delete removes from DB; reorder updates queue positions

- [x] [feat] Admin — single phrase entry (text box)
  - Done when: form adds phrase to end of queue; success/error shown

- [ ] [feat] Admin — CSV bulk import
  - Done when: valid CSV adds all rows; invalid rows reported; format `text,author`

- [ ] [feat] Admin — settings panel
  - Done when: Facebook credentials + posting toggle save to `settings` table

- [ ] [feat] Unsplash background per phrase
  - Done when: each phrase has unique background; URL cached in DB; graceful gradient fallback

- [ ] [feat] Facebook auto-post via cron
  - Done when: cron posts phrase to Facebook page; failure logged but doesn't block rotation

- [ ] [infra] Deploy to Vercel + configure cron
  - Done when: prod URL works; cron active; env vars set; Supabase prod connected

## Backlog
- [ ] Timezone-aware midnight reset (currently UTC)
- [ ] Facebook token auto-refresh before 60d expiry
- [ ] Low phrase stock warning in admin (< 7 unused)
- [ ] AI-generated backgrounds (Replicate/fal.ai) as Unsplash upgrade
- [ ] Mobile app (v2)
- [ ] Per-phrase visit analytics

## Blocked
| Task | Blocker | Since |
|------|---------|-------|

## Completed
| Task | Date |
|------|------|
| [setup] Init Next.js + TypeScript + Tailwind | 2026-04-13 |
| [setup] Supabase schema + client wiring | 2026-04-14 |
| [feat] Public phrase display page | 2026-04-14 |
| [feat] Daily phrase selection logic | 2026-04-14 |
| [feat] Admin auth | 2026-04-14 |
| [feat] Admin — phrase list + delete + reorder | 2026-04-14 |
| [feat] Admin — single phrase entry | 2026-04-14 |

## Tags
`[setup]` scaffold/config · `[feat]` feature · `[fix]` bug · `[refactor]` internal · `[test]` tests · `[infra]` deploy/CI · `[chore]` maintenance
