-- ================================================
-- FANOSCOIN COURSE PLATFORM — SUPABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ================================================
-- TABLES
-- ================================================

-- USERS (wallet-based identity)
create table if not exists public.users (
  id               uuid default gen_random_uuid() primary key,
  wallet_address   text unique not null,
  display_name     text,
  email            text,
  fanos_balance    numeric(18, 4) default 0,
  is_admin         boolean default false,
  created_at       timestamptz default now(),
  last_seen        timestamptz default now()
);

-- COURSES
create table if not exists public.courses (
  id               uuid default gen_random_uuid() primary key,
  title            text not null,
  description      text,
  price_fanos      numeric(18, 4) default 0,
  is_active        boolean default true,
  thumbnail_url    text,
  created_at       timestamptz default now()
);

-- MODULES (lessons inside a course)
create table if not exists public.modules (
  id               uuid default gen_random_uuid() primary key,
  course_id        uuid references public.courses(id) on delete cascade,
  title            text not null,
  description      text,
  content          text,
  video_url        text,
  order_index      integer not null default 0,
  is_published     boolean default true,
  created_at       timestamptz default now()
);

-- ENROLLMENTS
create table if not exists public.enrollments (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.users(id) on delete cascade,
  course_id        uuid references public.courses(id) on delete cascade,
  enrolled_at      timestamptz default now(),
  payment_status   text default 'pending' check (payment_status in ('pending','paid','free','refunded')),
  amount_paid      numeric(18, 4) default 0,
  tx_hash          text,
  unique(user_id, course_id)
);

-- MODULE PROGRESS
create table if not exists public.progress (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.users(id) on delete cascade,
  module_id        uuid references public.modules(id) on delete cascade,
  completed        boolean default false,
  completed_at     timestamptz,
  time_spent_secs  integer default 0,
  last_accessed    timestamptz default now(),
  unique(user_id, module_id)
);

-- QUIZ RESULTS
create table if not exists public.quiz_results (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.users(id) on delete cascade,
  module_id        uuid references public.modules(id) on delete cascade,
  score            integer not null,
  max_score        integer not null,
  passed           boolean not null,
  attempt_number   integer default 1,
  answers          jsonb,
  created_at       timestamptz default now()
);

-- CERTIFICATES
create table if not exists public.certificates (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.users(id) on delete cascade,
  course_id        uuid references public.courses(id) on delete cascade,
  issued_at        timestamptz default now(),
  cert_hash        text unique,
  unique(user_id, course_id)
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

alter table public.users         enable row level security;
alter table public.courses       enable row level security;
alter table public.modules       enable row level security;
alter table public.enrollments   enable row level security;
alter table public.progress      enable row level security;
alter table public.quiz_results  enable row level security;
alter table public.certificates  enable row level security;

-- USERS: anyone can read, users manage their own row
create policy "users_read_all"     on public.users for select using (true);
create policy "users_insert_own"   on public.users for insert with check (true);
create policy "users_update_own"   on public.users for update using (true);

-- COURSES: public readable
create policy "courses_read"       on public.courses for select using (is_active = true);
create policy "courses_all_admin"  on public.courses for all using (true);

-- MODULES: public readable
create policy "modules_read"       on public.modules for select using (is_published = true);
create policy "modules_all_admin"  on public.modules for all using (true);

-- ENROLLMENTS: open for insert/select (wallet verified in app)
create policy "enrollments_read"   on public.enrollments for select using (true);
create policy "enrollments_insert" on public.enrollments for insert with check (true);
create policy "enrollments_update" on public.enrollments for update using (true);

-- PROGRESS: open for insert/update
create policy "progress_read"      on public.progress for select using (true);
create policy "progress_insert"    on public.progress for insert with check (true);
create policy "progress_update"    on public.progress for update using (true);

-- QUIZ RESULTS: open
create policy "quiz_read"          on public.quiz_results for select using (true);
create policy "quiz_insert"        on public.quiz_results for insert with check (true);

-- CERTIFICATES: public readable
create policy "certs_read"         on public.certificates for select using (true);
create policy "certs_insert"       on public.certificates for insert with check (true);

-- ================================================
-- SEED DATA — BSC COURSE
-- ================================================

-- Insert the BSC Course
insert into public.courses (id, title, description, price_fanos, is_active)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'BSC Development Masterclass',
  'Learn to build on BNB Smart Chain from zero to deploying live smart contracts. 6 modules covering Solidity, BEP-20 tokens, DApps, security, and going live on mainnet.',
  0,
  true
);

-- Insert the 6 modules
insert into public.modules (course_id, title, description, order_index) values
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Blockchain Fundamentals', 'Understand how BSC works, wallets, gas, consensus and the ecosystem.', 1),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Solidity Smart Contracts', 'Write, test and deploy your first smart contract on BSC testnet.', 2),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'BEP-20 Token Creation', 'Create and deploy your own token with custom tokenomics and supply.', 3),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Smart Contract Security', 'Reentrancy, access control, signature verification and audit patterns.', 4),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'DApp Frontend with Web3', 'Connect contracts to a frontend using wagmi, viem and ethers.js.', 5),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Launch & Verify on BSCScan', 'Deploy to mainnet, verify on BSCScan and add liquidity on PancakeSwap.', 6);

-- ================================================
-- USEFUL VIEWS FOR ADMIN DASHBOARD
-- ================================================

-- Overall stats view
create or replace view public.admin_stats as
select
  (select count(*) from public.users)                                      as total_users,
  (select count(*) from public.enrollments where payment_status = 'paid')  as paid_enrollments,
  (select count(*) from public.enrollments)                                as total_enrollments,
  (select count(*) from public.certificates)                               as certificates_issued,
  (select coalesce(sum(amount_paid),0) from public.enrollments)            as total_revenue_fanos;

-- Per-module completion stats
create or replace view public.module_stats as
select
  m.title,
  m.order_index,
  count(p.id)                                        as started_count,
  count(p.id) filter (where p.completed = true)      as completed_count,
  round(
    count(p.id) filter (where p.completed = true)::numeric
    / nullif(count(p.id), 0) * 100, 1
  )                                                  as completion_rate
from public.modules m
left join public.progress p on p.module_id = m.id
group by m.id, m.title, m.order_index
order by m.order_index;

-- User progress summary
create or replace view public.user_progress_summary as
select
  u.wallet_address,
  u.display_name,
  u.created_at,
  count(distinct e.course_id)                               as enrolled_courses,
  count(distinct p.module_id) filter (where p.completed)   as modules_completed,
  max(p.last_accessed)                                      as last_active,
  exists(select 1 from public.certificates c where c.user_id = u.id) as has_certificate
from public.users u
left join public.enrollments e on e.user_id = u.id
left join public.progress p on p.user_id = u.id
group by u.id, u.wallet_address, u.display_name, u.created_at;

-- ================================================
-- DONE! Next steps:
-- 1. Go to Supabase > Settings > API
-- 2. Copy your Project URL and anon key
-- 3. Paste them into course-portal.html
-- ================================================
