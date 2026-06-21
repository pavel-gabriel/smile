# Deployment Runbook — Smile

This is a manual, owner-only procedure: it requires your Supabase, Vercel,
Unsplash, and Facebook accounts and secrets. Follow it top to bottom.

---

## 1. Supabase (database + auth)

1. Create a project at https://supabase.com (free tier).
2. In the SQL editor, run the schema below to create the three tables.
3. Note the project URL and keys (Project Settings → API):
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only secret)
4. Create the single admin user: Authentication → Users → Add user
   (email + password). This is the login used at `/admin/login`.

### Schema

```sql
-- Phrases: the content queue.
create table if not exists phrases (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author text,
  keywords text[],
  background_url text,
  queue_position int not null default 0,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- Daily selections: explicit audit log of which phrase ran on which date.
create table if not exists daily_selections (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  phrase_id uuid not null references phrases(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Settings: key/value store for Facebook creds, posting toggle, timezone.
create table if not exists settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
```

> The app talks to Supabase exclusively through the `service_role` key from
> server code, so Row Level Security is not required for v1. Do not expose the
> service-role key to the browser.

---

## 2. Unsplash (backgrounds)

1. Register an app at https://unsplash.com/developers.
2. Copy the **Access Key** → `UNSPLASH_ACCESS_KEY`.
3. If the key is missing, the app degrades gracefully to the gradient
   background — it never errors.

---

## 3. Facebook (auto-post) — optional

1. Create a Facebook Page and a Meta app with `pages_manage_posts`.
2. Generate a long-lived **Page Access Token** (~60-day expiry).
3. Enter the Page ID, token, and enable posting in the admin **Settings**
   panel (these are stored in the `settings` table). Env-var fallbacks
   `FACEBOOK_PAGE_ID` / `FACEBOOK_ACCESS_TOKEN` also work.
4. Token refresh is manual (see DEC-005). Re-paste the token every ~60 days.

---

## 4. Vercel (hosting + cron)

1. Import the GitHub repo at https://vercel.com (framework auto-detected as
   Next.js).
2. Add Environment Variables (Production) — all from the steps above:

   | Variable | Source |
   |----------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase |
   | `UNSPLASH_ACCESS_KEY` | Unsplash |
   | `CRON_SECRET` | generate: `openssl rand -hex 32` |

3. Deploy. The cron job in `vercel.json` (`/api/cron/daily` at `0 0 * * *`)
   is registered automatically. Vercel Cron sends the
   `Authorization: Bearer $CRON_SECRET` header, which the route verifies.

---

## 5. Post-deploy verification

1. Visit the production URL → gradient + "Something beautiful is coming"
   (no phrase selected yet).
2. Log in at `/admin/login`, add a few phrases (single or CSV import).
3. Manually fire the cron once to select today's phrase:

   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     https://<your-domain>/api/cron/daily
   ```

   Expect `{"status":"selected",...}`. Re-running returns
   `{"status":"already_selected"}` (idempotent).
4. Reload the public page → today's phrase + Unsplash background appear.
5. If Facebook is enabled, confirm the post on the page; check Vercel function
   logs for `[cron/daily] ... fb:posted`.

---

## Notes

- Midnight rotation is **UTC** in v1 (`timezone` setting is stored for future
  use — see TASKS backlog).
- Supabase free tier pauses after 7 days of inactivity; any visit wakes it.
