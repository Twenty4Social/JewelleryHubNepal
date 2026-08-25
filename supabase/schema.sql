create table if not exists public.leads (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('search', 'whatsapp_click', 'jeweller_signup')),
  session_id text not null,
  shop_id text,
  product_id text,
  query text,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_shop_id_idx on public.leads (shop_id, created_at desc);

alter table public.leads enable row level security;

-- No public policy: writes go through the server route using SUPABASE_SERVICE_ROLE_KEY.
