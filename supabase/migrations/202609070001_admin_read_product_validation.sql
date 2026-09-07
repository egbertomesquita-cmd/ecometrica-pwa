-- Permite ao administrador analisar avaliações do produto sem conceder
-- permissão para alterar ou excluir respostas pertencentes a outros usuários.
drop policy if exists "scientific_records_admin_select_product_validation"
  on public.scientific_records;

create policy "scientific_records_admin_select_product_validation"
on public.scientific_records
for select
to authenticated
using (
  record_type = 'product_validation'
  and exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

comment on policy "scientific_records_admin_select_product_validation"
on public.scientific_records is
  'Administradores podem somente consultar avaliações do produto de todos os usuários; escrita continua restrita ao proprietário.';
