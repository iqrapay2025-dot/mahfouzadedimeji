-- ============================================
-- Complete Setup Script — Personal Academic Website
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================

-- ── EXTENSIONS ──
create extension if not exists "pgcrypto";

-- ── POSTS TABLE ──
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default 'Edupeace'
    check (category in ('Edupeace', 'Books Review', 'The Alma Mater', 'Renaissance', 'Give & Take', 'Islam')),
  content text not null default '',
  featured_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Additional columns used by the frontend
  publish_date date not null default current_date,
  excerpt text not null default '',
  author text not null default 'Prof. Mahfouz A. Adedimeji',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── PUBLICATIONS TABLE ──
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('book', 'chapter', 'journal_article')),
  title text not null,
  authors text not null,
  publisher text,
  journal_name text,
  year int,
  pages text,
  -- Additional columns used by the frontend
  volume text,
  issue text,
  editors text,
  isbn text,
  doi text,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── SETTINGS TABLE (single row) ──
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  bio text not null default '',
  contact_email text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  -- Additional columns used by the frontend
  phone text not null default '',
  institution text not null default '',
  updated_at timestamptz not null default now()
);

-- ── MEDIA TABLE ──
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  name text not null,
  size text not null default '',
  type text not null default '',
  uploaded_at timestamptz not null default now()
);

-- ── CONTACT MESSAGES TABLE ──
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- ============================================
-- PROFILES TABLE (data-driven authorization)
-- ============================================
-- Links each auth.users row to a profile holding a role ('admin' / 'viewer').
-- RLS policies check auth.uid() against this table, so no UUID is hardcoded.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── UPDATED_AT TRIGGERS ──
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists set_publications_updated_at on public.publications;
create trigger set_publications_updated_at
  before update on public.publications
  for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── AUTO-CREATE PROFILE ON USER SIGNUP ──
-- Whenever a new row is inserted into auth.users (a user signs up or is
-- created in the dashboard), automatically create a matching profile with
-- the default role of 'viewer'. This guarantees every auth user has a
-- profile row that RLS policies can check against.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.posts enable row level security;
alter table public.publications enable row level security;
alter table public.settings enable row level security;
alter table public.media enable row level security;
alter table public.contact_messages enable row level security;
alter table public.profiles enable row level security;

-- ── PROFILES POLICIES ──

-- A user may read only their own profile row.
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- A user may update only their own profile row.
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- ── POSTS POLICIES ──

-- PUBLIC: Anonymous users may only read published posts.
drop policy if exists "Public can read published posts only" on public.posts;
create policy "Public can read published posts only"
  on public.posts for select
  to anon
  using (status = 'published');

-- AUTHENTICATED: Any signed-in user may read published posts too.
drop policy if exists "Authenticated users can read published posts" on public.posts;
create policy "Authenticated users can read published posts"
  on public.posts for select
  to authenticated
  using (status = 'published');

-- ADMIN: Only a user whose profile role = 'admin' may insert posts.
drop policy if exists "Admin can insert posts" on public.posts;
create policy "Admin can insert posts"
  on public.posts for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only a user whose profile role = 'admin' may update posts.
drop policy if exists "Admin can update posts" on public.posts;
create policy "Admin can update posts"
  on public.posts for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only a user whose profile role = 'admin' may delete posts.
drop policy if exists "Admin can delete posts" on public.posts;
create policy "Admin can delete posts"
  on public.posts for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── PUBLICATIONS POLICIES ──

-- PUBLIC: All publications are public read-only.
drop policy if exists "Public can read publications" on public.publications;
create policy "Public can read publications"
  on public.publications for select
  to anon, authenticated
  using (true);

-- ADMIN: Only a user whose profile role = 'admin' may insert publications.
drop policy if exists "Admin can insert publications" on public.publications;
create policy "Admin can insert publications"
  on public.publications for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only a user whose profile role = 'admin' may update publications.
drop policy if exists "Admin can update publications" on public.publications;
create policy "Admin can update publications"
  on public.publications for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only a user whose profile role = 'admin' may delete publications.
drop policy if exists "Admin can delete publications" on public.publications;
create policy "Admin can delete publications"
  on public.publications for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── SETTINGS POLICIES ──

-- PUBLIC: Settings are public read-only.
drop policy if exists "Public can read settings" on public.settings;
create policy "Public can read settings"
  on public.settings for select
  to anon, authenticated
  using (true);

-- ADMIN: Only a user whose profile role = 'admin' may update settings.
drop policy if exists "Admin can update settings" on public.settings;
create policy "Admin can update settings"
  on public.settings for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only admin may insert settings rows.
drop policy if exists "Admin can insert settings" on public.settings;
create policy "Admin can insert settings"
  on public.settings for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only admin may delete settings rows.
drop policy if exists "Admin can delete settings" on public.settings;
create policy "Admin can delete settings"
  on public.settings for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── MEDIA POLICIES ──

-- PUBLIC: Media files are public read-only.
drop policy if exists "Public can read media" on public.media;
create policy "Public can read media"
  on public.media for select
  to anon, authenticated
  using (true);

-- ADMIN: Only a user whose profile role = 'admin' may insert media.
drop policy if exists "Admin can insert media" on public.media;
create policy "Admin can insert media"
  on public.media for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only a user whose profile role = 'admin' may delete media.
drop policy if exists "Admin can delete media" on public.media;
create policy "Admin can delete media"
  on public.media for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── CONTACT MESSAGES POLICIES ──

-- PUBLIC: Anyone can submit a contact message (insert only).
drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- ADMIN: Only a user whose profile role = 'admin' may read contact messages.
drop policy if exists "Admin can read contact messages" on public.contact_messages;
create policy "Admin can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only admin may update contact messages.
drop policy if exists "Admin can update contact messages" on public.contact_messages;
create policy "Admin can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ADMIN: Only admin may delete contact messages.
drop policy if exists "Admin can delete contact messages" on public.contact_messages;
create policy "Admin can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.publications;
alter publication supabase_realtime add table public.settings;
alter publication supabase_realtime add table public.media;

-- ============================================
-- STORAGE BUCKET
-- ============================================
insert into storage.buckets (id, name, public)
values
  ('media', 'media', true),
  ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Public can view files in the media bucket.
drop policy if exists "Public can view media files" on storage.objects;
create policy "Public can view media files"
  on storage.objects for select
  using (bucket_id = 'media');

-- Public can view files in the post-images bucket.
drop policy if exists "Public can view post images" on storage.objects;
create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

-- Admin (profile role = 'admin') can upload media files.
drop policy if exists "Admin can upload media files" on storage.objects;
create policy "Admin can upload media files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Admin (profile role = 'admin') can upload post images.
drop policy if exists "Admin can upload post images" on storage.objects;
create policy "Admin can upload post images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Admin (profile role = 'admin') can update media files.
drop policy if exists "Admin can update media files" on storage.objects;
create policy "Admin can update media files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Admin (profile role = 'admin') can update post images.
drop policy if exists "Admin can update post images" on storage.objects;
create policy "Admin can update post images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'post-images'
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Admin (profile role = 'admin') can delete media files.
drop policy if exists "Admin can delete media files" on storage.objects;
create policy "Admin can delete media files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Admin (profile role = 'admin') can delete post images.
drop policy if exists "Admin can delete post images" on storage.objects;
create policy "Admin can delete post images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'post-images'
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- SEED SETTINGS
-- ============================================
insert into public.settings (id, bio, contact_email, social_links, phone, institution)
values (
  1,
  'Prof. Mahfouz Adedimeji is a Professor of Pragmatics and Applied Linguistics at the University of Ilorin, Nigeria, a Fulbright scholar, and a public intellectual whose writing spans language, education, Islamic scholarship, and African development. He has served in senior university administration and is a widely published author on language, identity, and peace.',
  'adedimeji@unilorin.edu.ng',
  '{"twitter": "@mahfouzade", "linkedin": "https://www.linkedin.com/in/mahfouz-adedimeji-62930586/", "researchgate": "https://www.researchgate.net/profile/Mahfouz-Adedimeji", "academia": "unilorin.academia.edu/MahfouzAdedimeji", "facebook": "https://www.facebook.com/mahfouzadedimeji2/", "googleScholar": "https://scholar.google.com/citations?user=Arsd1wMAAAAJ&hl=en"}'::jsonb,
  '+234 803 XXX XXXX',
  'University of Ilorin, Kwara State, Nigeria'
)
on conflict (id) do nothing;