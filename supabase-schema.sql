-- CLASSVOICE schema starter — NO COLLEGE EMAIL / NO OTP / NO STUDENT ACCOUNT
-- This schema does not establish that a visitor is an ET-D student.
-- It supports pseudonymous browser/device credentials only. A user can reset them.
-- Therefore it cannot honestly guarantee one human = one vote or student-only access.
-- Never expose raw browser tokens or voter hashes in aggregate/report endpoints.

create extension if not exists pgcrypto;

create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  subject text not null,
  course_code text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.concerns (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculty(id),
  category text not null check (category in (
    'Teaching & explanation','Pace & workload','Assessment & evaluation',
    'Classroom experience','Communication','Attendance & punctuality',
    'Resources & facilities','Other'
  )),
  title text not null check (char_length(title) between 8 and 120),
  body text not null check (char_length(body) between 20 and 1200),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','published','hidden','received','under_review','action_planned','resolved'))
);

create table if not exists public.concern_votes (
  concern_id uuid not null references public.concerns(id) on delete cascade,
  browser_token_hash text not null,
  reaction text not null default 'relate' check (reaction in ('relate')),
  created_at timestamptz not null default now(),
  primary key (concern_id, browser_token_hash)
);

create index if not exists concerns_created_at_idx on public.concerns(created_at desc);
create index if not exists concerns_faculty_idx on public.concerns(faculty_id);

alter table public.faculty enable row level security;
alter table public.concerns enable row level security;
alter table public.concern_votes enable row level security;

-- Public visitors can read only active faculty and published concerns.
-- No direct public inserts/updates/deletes are allowed.
create policy "public can view active faculty"
on public.faculty for select to anon, authenticated using (active = true);

create policy "public can view published concerns"
on public.concerns for select to anon, authenticated using (status = 'published');

-- Do not create a public SELECT policy for concern_votes.
-- Do not expose browser_token_hash, raw tokens, or row-level voter details.
-- Production submissions/votes must go through reviewed server-side functions
-- that hash tokens, rate-limit requests, sanitize content and moderate submissions.
-- Browser tokens are not proof of student identity and can be reset by clearing storage.

create or replace view public.concern_weekly_trends as
select date_trunc('week', created_at)::date as week_start,
       faculty_id,
       category,
       count(*) as concern_count
from public.concerns
where status in ('published','under_review','action_planned','resolved')
group by 1,2,3;

-- Before production:
-- 1) Decide whether the board is public or protected by a shared class invite code.
--    A shared code is a speed bump, not proof of student identity.
-- 2) Implement safe aggregate RPCs; never expose vote rows or token hashes.
-- 3) Enforce report minimum cohort thresholds (e.g. suppress counts under 5).
-- 4) Add moderation, rate limits, bot protection, audit/retention/deletion policy.
-- 5) Have an independent privacy/security reviewer test the design.
-- 6) Do not claim one-person-one-vote without a trustworthy identity/credential mechanism.


create or replace view public.concern_weekly_support_trends as
select date_trunc('week', v.created_at)::date as week_start,
       c.faculty_id,
       c.category,
       count(*) as support_count
from public.concern_votes v
join public.concerns c on c.id = v.concern_id
where c.status in ('published','under_review','action_planned','resolved')
group by 1,2,3;
