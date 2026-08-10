-- ============================================
-- Personal Academic Website — Initial Schema
-- ============================================

-- ── EXTENSIONS ──
create extension if not exists "pgcrypto";

-- ── POSTS TABLE ──
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  publish_date date not null default current_date,
  excerpt text not null default '',
  content text not null default '',
  featured_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author text not null default 'Prof. Mahfouz A. Adedimeji',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── PUBLICATIONS TABLE ──
create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  -- include 'journal_article' to match seeded data
  type text not null check (type in ('book', 'chapter', 'journal_article')),
  title text not null,
  authors text not null,
  year integer not null default 0,
  publisher text,
  journal_name text,
  volume text,
  issue text,
  pages text,
  editors text,
  isbn text,
  doi text,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── SETTINGS TABLE (single row) ──
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  bio text not null default '',
  email text not null default '',
  phone text not null default '',
  institution text not null default '',
  twitter text not null default '',
  linkedin text not null default '',
  researchgate text not null default '',
  academia text not null default '',
  facebook text not null default '',
  google_scholar text not null default '',
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

-- ── PROFILES TABLE (data-driven authorization) ──
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

create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger set_publications_updated_at
  before update on public.publications
  for each row execute function public.set_updated_at();

create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── SERVER-SIDE CONSTRAINTS (ADDITIONAL VALIDATION) ──
-- Basic length and format checks to prevent obviously invalid data
alter table public.posts
  add constraint posts_title_length check (char_length(title) between 1 and 250),
  add constraint posts_excerpt_length check (char_length(excerpt) <= 300),
  add constraint posts_content_length check (char_length(content) >= 20);

alter table public.publications
  add constraint pubs_title_length check (char_length(title) between 1 and 1000),
  add constraint pubs_authors_length check (char_length(authors) between 1 and 500),
  add constraint pubs_year_valid check (year >= 0 and year <= 9999);

alter table public.settings
  add constraint settings_email_format check (email = '' or email ~ '^[^@\s]+@[^@\s]+\\.[^@\s]+$');

-- ── AUTO-CREATE PROFILE ON USER SIGNUP ──
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── ROW LEVEL SECURITY ──
alter table public.posts enable row level security;
alter table public.publications enable row level security;
alter table public.settings enable row level security;
alter table public.media enable row level security;
alter table public.contact_messages enable row level security;
alter table public.profiles enable row level security;

-- ── PROFILES POLICIES ──
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── POSTS POLICIES ──
create policy "Public can read published posts"
  on public.posts for select
  to anon
  using (status = 'published');

create policy "Authenticated users can read published posts"
  on public.posts for select
  to authenticated
  using (status = 'published');

create policy "Admin can insert posts"
  on public.posts for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can update posts"
  on public.posts for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete posts"
  on public.posts for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── PUBLICATIONS POLICIES ──
create policy "Public can read publications"
  on public.publications for select
  to anon, authenticated
  using (true);

create policy "Admin can insert publications"
  on public.publications for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can update publications"
  on public.publications for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete publications"
  on public.publications for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── SETTINGS POLICIES ──
create policy "Public can read settings"
  on public.settings for select
  to anon, authenticated
  using (true);

create policy "Admin can update settings"
  on public.settings for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can insert settings"
  on public.settings for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete settings"
  on public.settings for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── MEDIA POLICIES ──
create policy "Public can read media"
  on public.media for select
  to anon, authenticated
  using (true);

create policy "Admin can insert media"
  on public.media for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete media"
  on public.media for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── CONTACT MESSAGES POLICIES ──
create policy "Public can insert contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admin can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── REALTIME ──
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.publications;
alter publication supabase_realtime add table public.settings;
alter publication supabase_realtime add table public.media;

-- ── STORAGE BUCKET ──
insert into storage.buckets (id, name, public)
values
  ('media', 'media', true),
  ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Admin can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Admin can upload post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "Admin can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "Admin can update post images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images');

create policy "Admin can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

create policy "Admin can delete post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');

-- ── SEED DATA ──
-- Seed settings (single row)
insert into public.settings (id, bio, email, phone, institution, twitter, linkedin, researchgate, academia, facebook, google_scholar)
values (
  1,
  'Prof. Mahfouz Adedimeji is a Professor of Pragmatics and Applied Linguistics at the University of Ilorin, Nigeria, a Fulbright scholar, and a public intellectual whose writing spans language, education, Islamic scholarship, and African development. He has served in senior university administration and is a widely published author on language, identity, and peace.',
  'adedimeji@unilorin.edu.ng',
  '+234 803 XXX XXXX',
  'University of Ilorin, Kwara State, Nigeria',
  '@mahfouzade',
  'https://www.linkedin.com/in/mahfouz-adedimeji-62930586/',
  'https://www.researchgate.net/profile/Mahfouz-Adedimeji',
  'unilorin.academia.edu/MahfouzAdedimeji',
  'https://www.facebook.com/mahfouzadedimeji2/',
  'https://scholar.google.com/citations?user=Arsd1wMAAAAJ&hl=en'
)
on conflict (id) do nothing;