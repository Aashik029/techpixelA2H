-- 0002_customer_auth.sql
-- Customer accounts + dashboard: link enquiries to authenticated users, add a
-- customer-visible/hidable profile, and let customers read/update ONLY their own
-- rows. Admin behaviour is unchanged.
--
-- Apply with `supabase db push`, or paste into the Supabase SQL editor.
-- RLS is already enabled on both tables in 0001, so no `enable row level security`.

-- ===================== enquiries =====================

-- Nullable on purpose: legacy/anon enquiries have no owner, and `on delete set
-- null` keeps the enquiry as a business record if the auth user is ever removed.
alter table public.enquiries
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists email text;

create index if not exists enquiries_user_id_idx on public.enquiries (user_id);

-- 0001 granted SELECT + UPDATE to authenticated but not INSERT; customers need it.
grant insert on table public.enquiries to authenticated;

-- Customers read only their own enquiries. Admin access is unchanged: the
-- existing "admin_select" policy still covers every enquiry for admins.
create policy "customer_select_own" on public.enquiries
for select to authenticated
using ((select auth.uid()) = user_id);

-- Customers insert only their own enquiries, and the row must start as 'new'.
create policy "customer_insert_own" on public.enquiries
for insert to authenticated
with check ((select auth.uid()) = user_id and status = 'new');

-- Tighten the public (anon) insert now that a user_id column exists: an
-- anonymous submission must not be able to attribute itself to a real user.
-- The public form sends no user_id, so it keeps working unchanged.
drop policy if exists "anon_insert" on public.enquiries;
create policy "anon_insert" on public.enquiries
for insert to anon
with check (user_id is null);

-- Deliberately NO customer UPDATE policy: customers can neither edit their
-- enquiries nor flip `status`. Column-level grants cannot be used to separate
-- admin from customer here because both share the `authenticated` role.

-- ===================== profiles =====================

alter table public.profiles
  add column if not exists name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists company text,
  add column if not exists created_at timestamptz not null default now();

-- 0001 ran `revoke all ... from anon, authenticated` with no policies, so a
-- policy alone is not enough: RLS needs the underlying table privilege too.
grant select, update on table public.profiles to authenticated;
-- deliberately no insert / delete grant for authenticated

create policy "profile_select_own" on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

-- WITH CHECK pins is_admin = false (fail-closed): a customer cannot promote
-- themselves. Omitting is_admin keeps the stored false; setting null fails the
-- NOT NULL constraint. Note: an admin editing their own profile through this
-- policy is rejected — admins bootstrap their row via SQL (below).
create policy "profile_update_own" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and is_admin = false);

-- ===================== signup profile bootstrap =====================

-- A new auth user automatically gets a customer profile row. security definer
-- so it works regardless of RLS; search_path pinned for safety. `is_admin` is
-- hard-coded false and signup metadata is NEVER trusted for it, so a client
-- sending options.data = { is_admin: true } cannot self-promote.
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.email,
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Optional hardening, mirrors the is_admin() style.
revoke execute on function public.handle_new_user () from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user ();

-- ===================== admin bootstrap (run manually, per admin) =====================
-- The trigger above now pre-creates a profile row with is_admin = false, so use
-- upsert instead of a plain insert:
--
--   insert into public.profiles (id, is_admin)
--   values ('<admin-user-uuid>', true)
--   on conflict (id) do update set is_admin = true;
