-- =============================================
-- NatNat Fresh Milk - Auth Setup & RLS Update
-- =============================================
-- This migration:
-- 1. Creates admin_profiles table (linked to auth.users)
-- 2. Drops old permissive write policies (allow anon)
-- 3. Adds new restrictive write policies (authenticated admins only)
-- 4. Adds policies for admin_profiles management

-- =============================================
-- Table: admin_profiles
-- =============================================
create table public.admin_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_profiles
alter table public.admin_profiles enable row level security;

-- Anyone can check if admin exists (for registration validation)
create policy "Public can read admin_profiles" on public.admin_profiles for select using (true);

-- Authenticated users can insert their own profile
create policy "Authenticated can insert admin_profile" on public.admin_profiles for insert 
  with check (auth.role() = 'authenticated' and auth.uid() = id);

-- Authenticated users can read their own profile
create policy "Authenticated can read own admin_profile" on public.admin_profiles for select 
  using (auth.role() = 'authenticated' and auth.uid() = id);

-- =============================================
-- Update RLS Policies: restrict write to authenticated admins
-- =============================================

-- Helper: drop old permissive write policies
drop policy if exists "Write products" on public.products;
drop policy if exists "Write mitra_sppg" on public.mitra_sppg;
drop policy if exists "Write articles" on public.articles;
drop policy if exists "Write lab_reports" on public.lab_reports;
drop policy if exists "Write orders" on public.orders;
drop policy if exists "Write deliveries" on public.deliveries;
drop policy if exists "Write tickets" on public.tickets;
drop policy if exists "Write promos" on public.promos;
drop policy if exists "Write landing_settings" on public.landing_settings;
drop policy if exists "Write about_settings" on public.about_settings;

-- New write policies: only authenticated users in admin_profiles can write
create policy "Authenticated admins can write products" on public.products for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write mitra_sppg" on public.mitra_sppg for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write articles" on public.articles for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write lab_reports" on public.lab_reports for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write orders" on public.orders for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write deliveries" on public.deliveries for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write tickets" on public.tickets for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write promos" on public.promos for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write landing_settings" on public.landing_settings for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Authenticated admins can write about_settings" on public.about_settings for all 
  using (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() = 'authenticated' and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));
