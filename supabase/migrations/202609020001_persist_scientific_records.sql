create table if not exists public.scientific_records (
  owner_id uuid not null references auth.users(id) on delete cascade,
  record_type text not null check (record_type in (
    'analysis_session', 'article', 'deduplication_audit', 'screening_session',
    'screening_decision', 'eligibility_decision', 'article_extraction',
    'activity', 'occurrence'
  )),
  record_id text not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (owner_id, record_type, record_id)
);

create index if not exists scientific_records_owner_type_idx
  on public.scientific_records (owner_id, record_type, updated_at desc);

alter table public.scientific_records enable row level security;

drop policy if exists "scientific_records_select_own" on public.scientific_records;
create policy "scientific_records_select_own"
on public.scientific_records for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "scientific_records_insert_own" on public.scientific_records;
create policy "scientific_records_insert_own"
on public.scientific_records for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "scientific_records_update_own" on public.scientific_records;
create policy "scientific_records_update_own"
on public.scientific_records for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "scientific_records_delete_own" on public.scientific_records;
create policy "scientific_records_delete_own"
on public.scientific_records for delete to authenticated
using ((select auth.uid()) = owner_id);

revoke all on public.scientific_records from anon;
grant select, insert, update, delete on public.scientific_records to authenticated;
