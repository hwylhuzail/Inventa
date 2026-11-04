create table if not exists public.inventa_ai_cache (
  cache_key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists inventa_ai_cache_expires_at_idx
  on public.inventa_ai_cache (expires_at);

alter table public.inventa_ai_cache enable row level security;

revoke all on public.inventa_ai_cache from anon, authenticated;
grant select, insert, update, delete on public.inventa_ai_cache to service_role;
