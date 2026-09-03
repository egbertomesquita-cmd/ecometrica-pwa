create index if not exists audit_history_actor_idx
  on public.audit_history (actor_id)
  where actor_id is not null;
