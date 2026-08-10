-- ─────────────────────────────────────────────────────────────
-- 005_admin_dashboard_read_all.sql
--
-- Guarantees the admin dashboard can read ALL posts (including
-- drafts) and ALL publications, even if earlier migrations were
-- not applied to a particular database.
--
-- The posts table's public/authenticated policies only allow
-- status = 'published'. Without an admin-bypass policy, the admin
-- panel's COUNT/Recent-Essays queries would silently return only
-- published rows (or zero if every row is a draft), which is why
-- a dedicated admin policy is required.
-- ─────────────────────────────────────────────────────────────

-- Admin can SELECT all posts (drafts + published)
drop policy if exists "Admin can read all posts" on public.posts;
create policy "Admin can read all posts"
  on public.posts
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admin can SELECT all publications
drop policy if exists "Admin can read all publications" on public.publications;
create policy "Admin can read all publications"
  on public.publications
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Sanity: RLS must be enabled for the policies above to take effect.
alter table public.posts enable row level security;
alter table public.publications enable row level security;