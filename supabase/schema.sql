-- Run this in your Supabase SQL Editor

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  leetcode_username text,
  groq_api_key text,
  email_notifications boolean default false,
  last_sync_at timestamptz,
  last_submission_timestamp bigint default 0,
  created_at timestamptz default now()
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  problem_id integer not null,
  problem_title text not null,
  problem_slug text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  lc_topic_tags text[] default '{}',
  submitted_code text,
  language text,
  submission_timestamp bigint,
  -- AI fields
  card_status text default 'pending' check (card_status in ('pending', 'generating', 'ready', 'failed')),
  pattern_tags text[] default '{}',
  core_intuition text,
  approach_summary text,
  optimal_approach text,
  time_complexity text,
  space_complexity text,
  gotchas text[] default '{}',
  struggle_assessment text,
  -- FSRS fields
  fsrs_stability float default 1.0,
  fsrs_difficulty float default 5.0,
  fsrs_reps integer default 0,
  fsrs_lapses integer default 0,
  fsrs_state text default 'new',
  due_date timestamptz default now(),
  last_reviewed_at timestamptz,
  -- Meta
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, problem_id)
);

create table review_logs (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer check (rating in (1,2,3,4)),
  reviewed_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table cards enable row level security;
alter table review_logs enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own cards" on cards for all using (auth.uid() = user_id);
create policy "own reviews" on review_logs for all using (auth.uid() = user_id);

-- Indexes
create index idx_cards_user_due on cards(user_id, due_date);
create index idx_cards_user_status on cards(user_id, card_status);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
