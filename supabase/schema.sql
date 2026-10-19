-- Схема для Supabase: профілі, прогрес, події статистики, адміністратори.
-- Виконується один раз у SQL Editor. Скрипт можна запускати повторно.

-- 1. Профілі (нікнейм користувача)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null default '' check (char_length(nickname) <= 32),
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

-- 2. Прогрес навчання (один JSON на користувача)
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3. Події статистики (лише за згодою користувача)
create table if not exists public.events (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  session_id uuid not null,
  user_id uuid references auth.users (id) on delete set null,
  type text not null check (type in ('pageview', 'answer', 'signin')),
  path text check (char_length(path) <= 200),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_created_at_idx on public.events (created_at);
create index if not exists events_visitor_idx on public.events (visitor_id);

-- 4. Адміністратори. Таблиця закрита для клієнтів (політик немає), заповнюється лише з SQL Editor.
create table if not exists public.admins (
  email text primary key
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.events enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Профілі: користувач бачить і змінює лише свій
drop policy if exists "profiles own select" on public.profiles;
drop policy if exists "profiles own insert" on public.profiles;
drop policy if exists "profiles own update" on public.profiles;
drop policy if exists "profiles own delete" on public.profiles;
create policy "profiles own select" on public.profiles for select to authenticated using (user_id = auth.uid());
create policy "profiles own insert" on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy "profiles own update" on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "profiles own delete" on public.profiles for delete to authenticated using (user_id = auth.uid());

-- Прогрес: так само
drop policy if exists "progress own select" on public.progress;
drop policy if exists "progress own insert" on public.progress;
drop policy if exists "progress own update" on public.progress;
drop policy if exists "progress own delete" on public.progress;
create policy "progress own select" on public.progress for select to authenticated using (user_id = auth.uid());
create policy "progress own insert" on public.progress for insert to authenticated with check (user_id = auth.uid());
create policy "progress own update" on public.progress for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress own delete" on public.progress for delete to authenticated using (user_id = auth.uid());

-- Події: будь-хто може додати подію (анонімно або від себе), читати їх може лише адміністратор через функцію нижче
drop policy if exists "events insert" on public.events;
drop policy if exists "events own delete" on public.events;
create policy "events insert" on public.events for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "events own delete" on public.events for delete to authenticated using (user_id = auth.uid());

-- Зведення для сторінки /admin. Повертає помилку, якщо викликає не адміністратор.
create or replace function public.admin_overview(days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  since timestamptz := now() - make_interval(days => greatest(1, least(days, 365)));
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'totals', (
      select jsonb_build_object(
        'visitors', count(distinct visitor_id),
        'sessions', count(distinct session_id),
        'pageviews', count(*) filter (where type = 'pageview'),
        'answers', count(*) filter (where type = 'answer'),
        'correct', count(*) filter (where type = 'answer' and (meta ->> 'correct') = 'true')
      ) from public.events where created_at >= since
    ),
    'registeredUsers', (select count(*) from public.profiles),
    'daily', coalesce((
      select jsonb_agg(row_to_json(d) order by d.day desc) from (
        select (created_at at time zone 'Europe/Kyiv')::date as day,
               count(distinct visitor_id) as visitors,
               count(*) filter (where type = 'pageview') as pageviews,
               count(*) filter (where type = 'answer') as answers,
               count(*) filter (where type = 'answer' and (meta ->> 'correct') = 'true') as correct
        from public.events where created_at >= since
        group by 1
      ) d
    ), '[]'::jsonb),
    'topPaths', coalesce((
      select jsonb_agg(row_to_json(p)) from (
        select path, count(*) as views, count(distinct visitor_id) as visitors
        from public.events where type = 'pageview' and created_at >= since
        group by path order by views desc limit 15
      ) p
    ), '[]'::jsonb),
    'hardest', coalesce((
      select jsonb_agg(row_to_json(h)) from (
        select meta ->> 'key' as key,
               count(*) as answers,
               count(*) filter (where (meta ->> 'correct') = 'false') as wrong
        from public.events where type = 'answer' and created_at >= since and meta ? 'key'
        group by 1 having count(*) >= 3
        order by (count(*) filter (where (meta ->> 'correct') = 'false'))::float / count(*) desc, count(*) desc
        limit 15
      ) h
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(row_to_json(v)) from (
        select coalesce(meta ->> 'device', 'невідомо') as device, count(distinct visitor_id) as visitors
        from public.events where type = 'pageview' and created_at >= since
        group by 1 order by visitors desc
      ) v
    ), '[]'::jsonb),
    'languages', coalesce((
      select jsonb_agg(row_to_json(l)) from (
        select coalesce(meta ->> 'lang', 'невідомо') as lang, count(distinct visitor_id) as visitors
        from public.events where type = 'pageview' and created_at >= since
        group by 1 order by visitors desc limit 10
      ) l
    ), '[]'::jsonb),
    'users', coalesce((
      select jsonb_agg(row_to_json(u)) from (
        select pr.nickname,
               au.email,
               pr.created_at,
               pr.last_seen,
               coalesce(jsonb_array_length(pg.data -> 'learnedVerbIds'), 0) as learned_verbs,
               coalesce((pg.data ->> 'correctAnswers')::int, 0) + coalesce((pg.data ->> 'wrongAnswers')::int, 0) as answers,
               coalesce((pg.data ->> 'correctAnswers')::int, 0) as correct
        from public.profiles pr
        join auth.users au on au.id = pr.user_id
        left join public.progress pg on pg.user_id = pr.user_id
        order by pr.last_seen desc limit 200
      ) u
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_overview(integer) from public, anon;
grant execute on function public.admin_overview(integer) to authenticated;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
