-- =============================================================================
-- Dr. Dalia AbdElMougood Zariaa Dental Clinic - Supabase Schema
-- Project: dr dalia (https://ksaxugyvzeudupnakrwk.supabase.co)
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. Articles / Posts Table (mirrors Ajar posts architecture)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_en text default '',
  excerpt text default '',
  excerpt_en text default '',
  content text not null default '',
  content_en text default '',
  cover_image text default '',
  image_alt text default '',
  image_caption text default '',
  category text not null default 'طب الأسنان العام',
  category_en text default 'General Dentistry',
  tags text[] not null default '{}',
  status text not null default 'published' check (status in ('published', 'draft')),
  featured boolean not null default false,
  show_on_homepage boolean not null default true,
  author_name text not null default 'د. داليا عبد الموجود زارع',
  author_name_en text not null default 'Dr. Dalia AbdElMougood Zariaa',
  author_role text not null default 'استشاري طب وجراحة الأسنان - القصر العيني',
  author_role_en text not null default 'Dental Consultant - Qasr El Ainy, Cairo University',
  author_avatar text default 'https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg',
  reading_time integer not null default 4,
  views integer not null default 0,
  seo_title text default '',
  seo_description text default '',
  focus_keyword text default '',
  key_takeaways jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  language text not null default 'both' check (language in ('ar', 'en', 'both')),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_category on public.posts(category);
create index if not exists idx_posts_published_at on public.posts(published_at desc);
create index if not exists idx_posts_featured on public.posts(featured);

-- 2. Site Analytics / Visitor Tracking Table
create table if not exists public.site_analytics (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text default '',
  path text not null default '/',
  page_title text default '',
  referrer text default 'Direct',
  source text not null default 'Direct',
  device text not null default 'Desktop',
  browser text default '',
  country text default 'EG',
  language text default 'ar',
  article_slug text default null,
  event_type text not null default 'pageview',
  created_at timestamptz not null default now()
);

create index if not exists idx_site_analytics_created_at on public.site_analytics(created_at desc);
create index if not exists idx_site_analytics_source on public.site_analytics(source);
create index if not exists idx_site_analytics_path on public.site_analytics(path);
create index if not exists idx_site_analytics_visitor_id on public.site_analytics(visitor_id);

-- Enable RLS
alter table public.posts enable row level security;
alter table public.site_analytics enable row level security;

-- Public read access for published posts
drop policy if exists "Public can view published posts" on public.posts;
create policy "Public can view published posts"
  on public.posts
  for select
  using (status = 'published');

-- Service role full access
drop policy if exists "Service role full access posts" on public.posts;
create policy "Service role full access posts"
  on public.posts
  for all
  using (true)
  with check (true);

drop policy if exists "Public can insert analytics" on public.site_analytics;
create policy "Public can insert analytics"
  on public.site_analytics
  for insert
  with check (true);

drop policy if exists "Service role full access analytics" on public.site_analytics;
create policy "Service role full access analytics"
  on public.site_analytics
  for all
  using (true)
  with check (true);
