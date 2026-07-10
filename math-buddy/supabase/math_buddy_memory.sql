create table if not exists public.math_buddy_user_memory (
  user_id uuid primary key references auth.users(id) on delete cascade,
  memory jsonb not null default '{}'::jsonb,
  daily_submissions jsonb not null default '{}'::jsonb,
  chapter_assessments jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.math_buddy_user_memory enable row level security;

create policy "Users can read their own Math Buddy memory"
  on public.math_buddy_user_memory
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own Math Buddy memory"
  on public.math_buddy_user_memory
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own Math Buddy memory"
  on public.math_buddy_user_memory
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own Math Buddy memory"
  on public.math_buddy_user_memory
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.math_buddy_user_memory to authenticated;
