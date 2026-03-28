-- Run this SQL in your Supabase SQL Editor to create the votes table

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  candidate_id text not null,
  voter_id text not null unique,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table votes enable row level security;

-- Allow anyone to insert (cast a vote)
create policy "Allow insert" on votes
  for insert with check (true);

-- Allow anyone to read votes (for showing results)
create policy "Allow read" on votes
  for select using (true);
