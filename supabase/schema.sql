-- Image Forge V3 -- Supabase Schema

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table user_profiles enable row level security;
create policy "Users read own profile" on user_profiles for select using (auth.uid() = id);
create policy "Users update own profile" on user_profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on user_profiles for insert with check (auth.uid() = id);

-- Saved designs
create table if not exists designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  template_id text,
  canvas_state jsonb not null default '{}',
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table designs enable row level security;
create policy "Users read own designs" on designs for select using (auth.uid() = user_id);
create policy "Users write own designs" on designs for insert with check (auth.uid() = user_id);
create policy "Users update own designs" on designs for update using (auth.uid() = user_id);
create policy "Users delete own designs" on designs for delete using (auth.uid() = user_id);

-- Brand kits
create table if not exists brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  colors jsonb default '[]',
  fonts jsonb default '[]',
  logos jsonb default '[]',
  created_at timestamptz default now()
);

alter table brand_kits enable row level security;
create policy "Users read own kits" on brand_kits for select using (auth.uid() = user_id);
create policy "Users write own kits" on brand_kits for insert with check (auth.uid() = user_id);
create policy "Users update own kits" on brand_kits for update using (auth.uid() = user_id);
create policy "Users delete own kits" on brand_kits for delete using (auth.uid() = user_id);

-- Asset library
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  url text not null,
  file_type text not null,
  file_size integer,
  created_at timestamptz default now()
);

alter table assets enable row level security;
create policy "Users read own assets" on assets for select using (auth.uid() = user_id);
create policy "Users write own assets" on assets for insert with check (auth.uid() = user_id);
create policy "Users delete own assets" on assets for delete using (auth.uid() = user_id);

-- Analytics
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table analytics_events enable row level security;
create policy "Insert analytics" on analytics_events for insert with check (true);
