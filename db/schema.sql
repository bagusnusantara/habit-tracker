-- Create Habits table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  frequency text not null, -- 'daily', 'weekly'
  target_count int not null default 1,
  preferred_time_of_day text, -- 'morning', 'afternoon', 'evening'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Schedules table
create table public.schedules (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users not null,
  scheduled_date date not null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.habits enable row level security;
alter table public.schedules enable row level security;

-- Policies for Habits
create policy "Users can view their own habits" on public.habits
  for select using (auth.uid() = user_id);

create policy "Users can insert their own habits" on public.habits
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own habits" on public.habits
  for update using (auth.uid() = user_id);

create policy "Users can delete their own habits" on public.habits
  for delete using (auth.uid() = user_id);

-- Policies for Schedules
create policy "Users can view their own schedules" on public.schedules
  for select using (auth.uid() = user_id);

create policy "Users can insert their own schedules" on public.schedules
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own schedules" on public.schedules
  for update using (auth.uid() = user_id);
