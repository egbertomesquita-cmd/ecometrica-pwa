-- Consolida a leitura do proprietário e a leitura administrativa do SUS em
-- uma única política permissiva, evitando avaliações duplicadas por consulta.
drop policy if exists "scientific_records_select_own"
  on public.scientific_records;
drop policy if exists "scientific_records_admin_select_product_validation"
  on public.scientific_records;

create policy "scientific_records_select_authorized"
on public.scientific_records
for select
to authenticated
using (
  owner_id = (select auth.uid())
  or (
    record_type = 'product_validation'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
);

comment on policy "scientific_records_select_authorized"
on public.scientific_records is
  'Cada usuário consulta os próprios registros; administradores também consultam avaliações do produto, sem escrita adicional.';
