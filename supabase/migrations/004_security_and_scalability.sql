-- ============================================
-- Security & Scalability Fixes
-- ============================================

-- ── DATABASE INDEXES ──
-- Improve query performance for frequently accessed columns

create index if not exists idx_posts_status_publish_date
  on public.posts (status, publish_date desc);

create index if not exists idx_posts_slug
  on public.posts (slug);

create index if not exists idx_posts_category
  on public.posts (category);

create index if not exists idx_publications_year
  on public.publications (year desc);

create index if not exists idx_publications_type
  on public.publications (type);

create index if not exists idx_media_uploaded_at
  on public.media (uploaded_at desc);

create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);

create index if not exists idx_contact_messages_read
  on public.contact_messages (read);

-- ── KV STORE RLS ──
-- The kv_store table is used by the server function with the service role key.
-- Enable RLS and deny all direct client access to prevent data leakage.

alter table public.kv_store_ca594394 enable row level security;

-- No policies = deny all. This table should only be accessed via the
-- server function using the service role key (which bypasses RLS).

-- ── CONTACT MESSAGE RATE LIMITING ──
-- Prevent spam by limiting submissions per email/IP to 5 per hour.

create table if not exists public.contact_rate_limits (
  email text primary key,
  ip_address text not null default '',
  count int not null default 1,
  window_start timestamptz not null default now()
);

create index if not exists idx_contact_rate_limits_window
  on public.contact_rate_limits (window_start);

-- Function to check and increment rate limit
create or replace function public.check_contact_rate_limit(
  p_email text,
  p_ip text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_window_start timestamptz;
begin
  -- Clean up old entries
  delete from public.contact_rate_limits
  where window_start < now() - interval '1 hour';

  -- Get or create the rate limit entry
  select count, window_start into v_count, v_window_start
  from public.contact_rate_limits
  where email = lower(p_email);

  if v_count is null then
    insert into public.contact_rate_limits (email, ip_address, count, window_start)
    values (lower(p_email), p_ip, 1, now());
    return true;
  end if;

  -- If window expired, reset
  if v_window_start < now() - interval '1 hour' then
    update public.contact_rate_limits
    set count = 1, window_start = now(), ip_address = p_ip
    where email = lower(p_email);
    return true;
  end if;

  -- Check limit (5 per hour)
  if v_count >= 5 then
    return false;
  end if;

  -- Increment count
  update public.contact_rate_limits
  set count = count + 1, ip_address = p_ip
  where email = lower(p_email);

  return true;
end;
$$;

-- ── CONTACT MESSAGE VALIDATION TRIGGER ──
-- Enforce server-side validation on contact messages

create or replace function public.validate_contact_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Trim and validate fields
  new.name := trim(new.name);
  new.email := lower(trim(new.email));
  new.subject := trim(new.subject);
  new.message := trim(new.message);

  -- Validate required fields
  if length(new.name) < 2 then
    raise exception 'Name must be at least 2 characters';
  end if;

  if length(new.name) > 100 then
    raise exception 'Name must be 100 characters or less';
  end if;

  if new.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Invalid email address';
  end if;

  if length(new.email) > 254 then
    raise exception 'Email must be 254 characters or less';
  end if;

  if length(new.subject) < 3 then
    raise exception 'Subject must be at least 3 characters';
  end if;

  if length(new.subject) > 200 then
    raise exception 'Subject must be 200 characters or less';
  end if;

  if length(new.message) < 10 then
    raise exception 'Message must be at least 10 characters';
  end if;

  if length(new.message) > 5000 then
    raise exception 'Message must be 5000 characters or less';
  end if;

  -- Rate limit check
  if not public.check_contact_rate_limit(new.email, current_setting('request.headers', true)::jsonb ->> 'x-forwarded-for') then
    raise exception 'Too many messages. Please try again later.';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_contact_message_trigger on public.contact_messages;
create trigger validate_contact_message_trigger
  before insert on public.contact_messages
  for each row execute function public.validate_contact_message();

-- ── ADMIN READ POLICIES ──
-- Allow admins to SELECT all posts (including drafts) and all publications.
-- Without these, the admin dashboard cannot read draft essays or count rows,
-- because the only existing SELECT policies restrict posts to status='published'.

drop policy if exists "Admin can read all posts" on public.posts;
create policy "Admin can read all posts"
  on public.posts for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admin can read all publications" on public.publications;
create policy "Admin can read all publications"
  on public.publications for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── POST CONTENT SANITIZATION ──
-- Prevent XSS by stripping dangerous HTML from post content

create or replace function public.sanitize_post_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Remove script tags and event handlers
  new.content := regexp_replace(new.content, '<script[^>]*>.*?</script>', '', 'gi');
  new.content := regexp_replace(new.content, 'on\w+\s*=\s*"[^"]*"', '', 'gi');
  new.content := regexp_replace(new.content, 'on\w+\s*=\s*''[^'']*''', '', 'gi');
  new.content := regexp_replace(new.content, 'javascript:', '', 'gi');
  new.content := regexp_replace(new.content, 'data:text/html', '', 'gi');

  -- Limit content size
  if length(new.content) > 100000 then
    raise exception 'Post content exceeds maximum length';
  end if;

  -- Limit title length
  if length(new.title) > 200 then
    raise exception 'Title exceeds maximum length';
  end if;

  -- Limit excerpt length
  if length(new.excerpt) > 500 then
    raise exception 'Excerpt exceeds maximum length';
  end if;

  return new;
end;
$$;

drop trigger if exists sanitize_post_content_trigger on public.posts;
create trigger sanitize_post_content_trigger
  before insert or update on public.posts
  for each row execute function public.sanitize_post_content();

-- ── REVOKE PUBLIC REALTIME ACCESS ──
-- Only authenticated users should receive realtime updates.
-- Anonymous users should not subscribe to realtime channels.

revoke all on table public.posts from anon;
revoke all on table public.publications from anon;
revoke all on table public.settings from anon;
revoke all on table public.media from anon;
revoke all on table public.contact_messages from anon;
revoke all on table public.profiles from anon;
revoke all on table public.kv_store_ca594394 from anon;
revoke all on table public.contact_rate_limits from anon;

-- ── STORAGE BUCKETS ──
-- Ensure both buckets exist (idempotent). post-images may be missing
-- if the database was set up from an older migration that only created media.

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

-- Admin can upload media files.
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

-- Admin can upload post images.
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

-- Admin can update media files.
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

-- Admin can update post images.
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

-- Admin can delete media files.
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

-- Admin can delete post images.
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

-- ── STORAGE FILE SIZE VALIDATION ──
-- Enforce file size limits at the storage level

create or replace function public.check_storage_file_size()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 5MB limit for media and post-images buckets
  if new.bucket_id in ('media', 'post-images') and new.metadata->>'size' is not null then
    if (new.metadata->>'size')::bigint > 5 * 1024 * 1024 then
      raise exception 'File exceeds 5MB limit';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists check_storage_file_size_trigger on storage.objects;
create trigger check_storage_file_size_trigger
  before insert or update on storage.objects
  for each row execute function public.check_storage_file_size();
