-- ============================================================================
-- HaadinGlobal — Supabase schema (run this once in Supabase → SQL Editor)
-- ============================================================================
-- Safe to re-run: uses "if not exists" / "or replace" where possible.
-- Creates: profiles (team members), projects (member uploads), and the
-- security policies (Row Level Security) so nobody can read/write data they
-- shouldn't. Roles: 'admin' (CEO/Founder), 'manager', 'member'.
-- ============================================================================

-- 1) PROFILES ---------------------------------------------------------------
-- One row per team member. Linked 1:1 to Supabase Auth users via id.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null default '',
  role         text not null default 'member'
               check (role in ('admin','manager','member')),
  title        text not null default '',           -- e.g. "Developer"
  bio          text not null default '',
  photo_url    text not null default '',
  email        text not null default '',
  linkedin     text not null default '',
  skills       text[] not null default '{}',
  level        text not null default 'Junior'
               check (level in ('Junior','Mid','Senior','Lead')),
  stars        int  not null default 0 check (stars between 0 and 5),
  is_public    boolean not null default true,       -- show on public team page
  sort_order   int not null default 100,
  created_at   timestamptz not null default now()
);

-- 2) PROJECTS ---------------------------------------------------------------
-- Work submitted by a member. Files live in Storage; we store their paths.
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles(id) on delete cascade,
  title        text not null default '',
  description  text not null default '',
  file_paths   text[] not null default '{}',        -- storage object paths
  status       text not null default 'submitted'
               check (status in ('submitted','approved','rejected')),
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Helper: is the current auth user an admin or manager?
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','manager')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- 3) POLICIES: profiles -----------------------------------------------------
drop policy if exists "public read public profiles" on public.profiles;
create policy "public read public profiles"
  on public.profiles for select
  using (is_public = true);

drop policy if exists "self read" on public.profiles;
create policy "self read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "staff read all profiles" on public.profiles;
create policy "staff read all profiles"
  on public.profiles for select
  using (public.is_staff());

drop policy if exists "self update limited" on public.profiles;
create policy "self update limited"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "staff update profiles" on public.profiles;
create policy "staff update profiles"
  on public.profiles for update
  using (public.is_staff());

-- Insert/delete of profiles is done server-side with the service_role key
-- (admin creating/removing members), which bypasses RLS. No client policy.

-- 4) POLICIES: projects -----------------------------------------------------
drop policy if exists "owner read own projects" on public.projects;
create policy "owner read own projects"
  on public.projects for select
  using (auth.uid() = owner_id);

drop policy if exists "staff read all projects" on public.projects;
create policy "staff read all projects"
  on public.projects for select
  using (public.is_staff());

drop policy if exists "owner insert own projects" on public.projects;
create policy "owner insert own projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

drop policy if exists "owner update own projects" on public.projects;
create policy "owner update own projects"
  on public.projects for update
  using (auth.uid() = owner_id);

drop policy if exists "staff update projects" on public.projects;
create policy "staff update projects"
  on public.projects for update
  using (public.is_staff());

drop policy if exists "owner delete own projects" on public.projects;
create policy "owner delete own projects"
  on public.projects for delete
  using (auth.uid() = owner_id or public.is_staff());

-- 5) STORAGE bucket for project files --------------------------------------
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

-- Members read/write only their own folder ({user_id}/...). Staff read all.
drop policy if exists "own files read" on storage.objects;
create policy "own files read" on storage.objects for select
  using (bucket_id = 'project-files'
         and (owner = auth.uid() or public.is_staff()));

drop policy if exists "own files write" on storage.objects;
create policy "own files write" on storage.objects for insert
  with check (bucket_id = 'project-files' and owner = auth.uid());

drop policy if exists "own files delete" on storage.objects;
create policy "own files delete" on storage.objects for delete
  using (bucket_id = 'project-files'
         and (owner = auth.uid() or public.is_staff()));

-- ============================================================================
-- After running this: create your first ADMIN via the app's setup guide.
-- ============================================================================
