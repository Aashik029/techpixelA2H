-- 0001_enquiries.sql — Admin leads backend (Phase 1, T1.2).
-- Applied via Supabase MCP `supabase_apply_migration` ONLY after owner
-- confirms the target project is restored and reachable.
-- Columns mirror the TargoContact wizard payload 1:1.

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  service text not null,
  answers jsonb not null default '{}'::jsonb,
  budget text not null,
  timeline text not null,
  subject text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied'))
);

alter table public.enquiries enable row level security;

-- Default-deny: no blanket grants; policies below are the only access.
revoke all on table public.enquiries from anon, authenticated;

-- Public contact form: anyone may INSERT (honeypot + validation live in UI).
grant insert on table public.enquiries to anon;

-- Admin inbox: authenticated admins may SELECT + UPDATE (no DELETE to anyone).
grant select, update on table public.enquiries to authenticated;

-- Admin flag table: one row per admin, pointing at auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;

-- No policies on profiles: only service_role / dashboard SQL touches it.
-- Bootstrap (owner runs in SQL editor after creating the admin auth user):
--   insert into public.profiles (id, is_admin)
--   values ('<admin-auth-user-uuid>', true);

-- Definer helper so RLS policies never read profiles directly.
create schema if not exists private;

create or replace function private.is_admin() returns boolean
language plpgsql
security definer
set search_path = ''
stable
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  );
end;
$$;

revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

-- Anon may insert leads, nothing else.
create policy "anon_insert"
  on public.enquiries for insert to anon
  with check (true);

-- Admins may read every lead.
create policy "admin_select"
  on public.enquiries for select to authenticated
  using ((select private.is_admin()));

-- Admins may flip status new -> read -> replied.
create policy "admin_update"
  on public.enquiries for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
