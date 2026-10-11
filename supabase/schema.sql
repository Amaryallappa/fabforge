-- ========================================================
-- FabForge India - Supabase Database Schema
-- Production Ready: Quotes, Orders, Profiles, RLS, Storage
-- ========================================================

-- 1. Profiles Table (Indian SME buyers & machinists)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text unique,
  full_name text,
  company text,
  gstin text,
  state_code text default '27', -- Maharashtra default
  whatsapp_opted boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Quotes Table
create table if not exists public.quotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  file_name text not null,
  file_url text,
  material text not null,
  thickness_mm numeric,
  quantity integer not null default 1,
  process text not null,
  secondary_ops text[] default '{}',
  price_inr numeric not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_production', 'shipped', 'delivered')),
  lead_time_days integer default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders Table (Razorpay & GST Tracking)
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references public.quotes on delete cascade not null,
  user_id uuid references auth.users on delete set null,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'authorized', 'captured', 'failed', 'refunded')),
  shipping_address jsonb,
  gstin text,
  invoice_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- Row Level Security (RLS) Policies
-- ========================================================
alter table public.profiles enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;

-- Profiles: Users can view & update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Quotes: Users can view their own quotes or anonymous public quotes
create policy "Anyone can create quotes"
  on public.quotes for insert
  with check (true);

create policy "Users can view own quotes"
  on public.quotes for select
  using (auth.uid() = user_id or user_id is null);

-- Orders: Users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

-- ========================================================
-- Storage Buckets (cad-files, invoices)
-- ========================================================
insert into storage.buckets (id, name, public) 
values ('cad-files', 'cad-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('invoices', 'invoices', true)
on conflict (id) do nothing;
