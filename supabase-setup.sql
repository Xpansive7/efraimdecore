-- Efraim Decore – setup das tabelas
create table if not exists clients (
  id uuid primary key,
  name text not null default '',
  phone text default '',
  address text default '',
  origin text default '',
  environment text default '',
  city text default '',
  notes text default '',
  created_at text default ''
);

create table if not exists budgets (
  id uuid primary key,
  client_id uuid,
  title text not null default '',
  status text default 'rascunho',
  price numeric default 0,
  cost numeric default 0,
  business_days integer default 0,
  description text default '',
  materials jsonb default '[]'::jsonb,
  created_at text default ''
);

create table if not exists projects (
  id uuid primary key,
  client_id uuid,
  source_budget_id uuid,
  title text not null default '',
  status text default 'em producao',
  price numeric default 0,
  cost numeric default 0,
  business_days integer default 0,
  start_date text default '',
  description text default '',
  materials jsonb default '[]'::jsonb,
  created_at text default ''
);

-- Habilita RLS
alter table clients enable row level security;
alter table budgets enable row level security;
alter table projects enable row level security;

-- Permite acesso total pela chave anon (somente os sócios têm a URL)
create policy "anon_all" on clients  for all to anon using (true) with check (true);
create policy "anon_all" on budgets  for all to anon using (true) with check (true);
create policy "anon_all" on projects for all to anon using (true) with check (true);
