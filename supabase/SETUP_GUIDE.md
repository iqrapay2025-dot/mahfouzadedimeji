# Supabase Backend Setup Guide

The full backend for the personal academic website is now wired to Supabase. Follow these steps to complete the setup.

## Prerequisites

Your Supabase project is already connected:
- **Project ID:** `uxyjbzzdxwppezxfupyn`
- **Client:** `src/lib/supabaseClient.ts` (reads from env vars)
- **Data service:** `utils/supabase/dataService.ts` (all CRUD, auth, storage, realtime)

---

## Step 0 — Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Set your real values:
   - `VITE_SUPABASE_URL=https://uxyjbzzdxwppezxfupyn.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=<your anon key from Dashboard → Settings → API>`

> `.env*` is gitignored so real keys are never committed. `.env.example` is the committed template.

---

## Step 1 — Run the Database Schema

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project **`uxyjbzzdxwppezxfupyn`**
3. Open **SQL Editor** → **New query**
4. Copy the entire contents of **`supabase/migrations/003_complete_setup.sql`**
5. Click **Run**

This creates:
- `posts` table (essays)
- `publications` table (books, chapters, articles)
- `settings` table (site config, seeded)
- `media` table (media library)
- `contact_messages` table (contact form submissions)
- Row Level Security policies (public read for published content, admin full access)
- Realtime publication for live sync
- `media` storage bucket with public read / admin upload policies

---

## Step 2 — Seed Content (Optional)

To populate the site with the sample essays and publication archive:

1. Open **SQL Editor** → **New query**
2. Copy the contents of **`supabase/migrations/002_seed_data.sql`**
3. Click **Run**

---

## Step 3 — Create the Admin Auth User + Assign Admin Role

Administration is **data-driven** via a `profiles` table linked to `auth.users` with a `role` column (`'admin'` or `'viewer'`). This avoids hardcoding any UUID in policies — rotating the admin later is just an UPDATE on the profiles table.

1. In the Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email:** `admin@mahfouz.ng`
   - **Password:** `admin2025`
   - Toggle **Auto Confirm User** ON
4. Click **Create user** — the SQL trigger `on_auth_user_created` automatically inserts a matching profile row with role `'viewer'`
5. Go to **SQL Editor** → **New query** and run:
   ```sql
   -- Look up the generated profile for the admin user
   select id from auth.users where email = 'admin@mahfouz.ng';

   -- Promote the profile to admin (data-driven, no hardcoded UUIDs in policies)
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'admin@mahfouz.ng');
   ```

The site uses Supabase Auth for the admin login. Sign-up is disabled — only the created user can sign in, and their profile role determines what they can do.

---

## Step 4 — Verify Realtime

Realtime is enabled automatically when you run the migration. The app subscribes to:
- `posts` — essays live-update when published/edited/deleted
- `publications` — scholarly works live-update
- `settings` — site config live-updates
- `media` — media library live-updates

Open the public site and the admin panel in two tabs — changes made in the admin appear instantly on the public site.

---

## Step 5 — Storage Bucket

The `media` storage bucket is created and public. The media library in the admin panel uploads images directly to Supabase Storage and records them in the `media` table.

---

## What Was Built

| File | Purpose |
|---|---|
| `utils/supabase/client.ts` | Supabase client singleton |
| `utils/supabase/dataService.ts` | All DB operations: posts, publications, settings, media, contact messages, auth, storage, realtime |
| `src/context/AppContext.tsx` | Refactored from hardcoded data → Supabase with realtime subscriptions |
| `src/pages/admin/*` | Admin CRUD pages now call Supabase |
| `src/pages/public/Contact.tsx` | Contact form persists messages to Supabase |
| `supabase/migrations/*.sql` | Schema + seed data migrations |
| `supabase/config.toml` | Supabase project config |

---

## Troubleshooting

**Empty public site?** — You need to run Step 1 + Step 2 SQL scripts.

**Can't log in?** — Make sure you created the auth user in Step 3.

**Media uploads failing?** — Ensure you're logged in as admin (uploads require the authenticated role).