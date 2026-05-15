create extension if not exists pgcrypto;

create table if not exists public.courses (
  id text primary key,
  name text not null,
  category text not null,
  exam_format text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz not null default now(),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  selected_course text references public.courses(id) on delete set null
);

create table if not exists public.units (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  unit_name text not null,
  unit_number integer not null check (unit_number > 0),
  unique (course_id, unit_number)
);

create table if not exists public.concepts (
  id text primary key,
  unit_id text not null references public.units(id) on delete cascade,
  concept_name text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  exam_frequency integer not null default 3 check (exam_frequency between 1 and 5),
  importance_weight numeric(4,2) not null default 1.00 check (importance_weight > 0)
);

create table if not exists public.questions (
  id text primary key,
  concept_id text not null references public.concepts(id) on delete cascade,
  question_type text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  source_type text not null,
  prompt text not null,
  stimulus text,
  choices jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  correct boolean not null,
  response_time integer not null default 0 check (response_time >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null references public.concepts(id) on delete cascade,
  mastery_score integer not null default 30 check (mastery_score between 0 and 100),
  last_reviewed timestamptz not null default now(),
  unique (user_id, concept_id)
);

create index if not exists units_course_id_idx on public.units(course_id);
create index if not exists concepts_unit_id_idx on public.concepts(unit_id);
create index if not exists questions_concept_id_idx on public.questions(concept_id);
create index if not exists questions_type_difficulty_idx on public.questions(question_type, difficulty);
create index if not exists attempts_user_created_at_idx on public.attempts(user_id, created_at desc);
create index if not exists attempts_question_id_idx on public.attempts(question_id);
create index if not exists mastery_user_score_idx on public.mastery(user_id, mastery_score asc);
create index if not exists mastery_concept_id_idx on public.mastery(concept_id);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.concepts enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.mastery enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Profiles are updateable by owner" on public.profiles;
create policy "Profiles are updateable by owner"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Authenticated users can read courses" on public.courses;
create policy "Authenticated users can read courses"
on public.courses for select
to authenticated
using (true);

drop policy if exists "Authenticated users can read units" on public.units;
create policy "Authenticated users can read units"
on public.units for select
to authenticated
using (true);

drop policy if exists "Authenticated users can read concepts" on public.concepts;
create policy "Authenticated users can read concepts"
on public.concepts for select
to authenticated
using (true);

drop policy if exists "Authenticated users can read approved questions" on public.questions;
create policy "Authenticated users can read approved questions"
on public.questions for select
to authenticated
using (true);

drop policy if exists "Users can read own attempts" on public.attempts;
create policy "Users can read own attempts"
on public.attempts for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own attempts" on public.attempts;
create policy "Users can insert own attempts"
on public.attempts for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can read own mastery" on public.mastery;
create policy "Users can read own mastery"
on public.mastery for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own mastery" on public.mastery;
create policy "Users can insert own mastery"
on public.mastery for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own mastery" on public.mastery;
create policy "Users can update own mastery"
on public.mastery for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
