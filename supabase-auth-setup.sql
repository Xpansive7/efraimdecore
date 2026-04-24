-- Atualiza RLS: só usuários autenticados acessam os dados
drop policy if exists "anon_all" on clients;
drop policy if exists "anon_all" on budgets;
drop policy if exists "anon_all" on projects;

create policy "auth_all" on clients  for all to authenticated using (true) with check (true);
create policy "auth_all" on budgets  for all to authenticated using (true) with check (true);
create policy "auth_all" on projects for all to authenticated using (true) with check (true);
