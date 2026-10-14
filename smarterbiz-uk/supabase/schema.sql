-- SmarterBiz.uk database schema. Run in the Supabase SQL editor (Project → SQL Editor → New query).
-- RLS is enabled with NO public policies: only the server-side service-role key can read/write.

create extension if not exists citext;

create table if not exists public.subscribers (
  id bigint generated always as identity primary key,
  email citext not null unique,
  source text not null default 'site',
  consent_text text not null,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 100),
  email citext not null,
  subject text not null check (subject in ('general','editorial','correction','partnership','press')),
  message text not null check (char_length(message) between 20 and 5000),
  created_at timestamptz not null default now(),
  handled boolean not null default false
);

create table if not exists public.tool_submissions (
  id bigint generated always as identity primary key,
  tool_name text not null check (char_length(tool_name) between 2 and 100),
  tool_url text not null check (tool_url ~* '^https://'),
  category text not null,
  contact_name text not null,
  email citext not null,
  description text not null check (char_length(description) between 30 and 2000),
  uk_pricing text not null default '',
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','rejected')),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.tool_submissions enable row level security;

-- Belt and braces: make sure anonymous/authenticated roles have no direct table access.
revoke all on public.subscribers, public.contact_messages, public.tool_submissions from anon, authenticated;

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists tool_submissions_status_idx on public.tool_submissions (status, created_at desc);
