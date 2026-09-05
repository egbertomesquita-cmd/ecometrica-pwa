alter table public.scientific_records
  drop constraint if exists scientific_records_record_type_check;

alter table public.scientific_records
  add constraint scientific_records_record_type_check check (record_type in (
    'analysis_session', 'article', 'deduplication_audit', 'screening_session',
    'screening_decision', 'eligibility_decision', 'article_extraction',
    'activity', 'occurrence', 'product_validation'
  ));

comment on table public.scientific_records is
  'Registros científicos e avaliações do produto, isolados por proprietário com RLS.';
