-- =============================================
-- Fix RLS policies to allow anon write
-- Run this AFTER 002_complete_setup.sql
-- =============================================

-- Drop old restrictive policies
drop policy if exists "Authenticated admins can write products" on public.products;
drop policy if exists "Authenticated admins can write mitra_sppg" on public.mitra_sppg;
drop policy if exists "Authenticated admins can write articles" on public.articles;
drop policy if exists "Authenticated admins can write lab_reports" on public.lab_reports;
drop policy if exists "Authenticated admins can write orders" on public.orders;
drop policy if exists "Authenticated admins can write deliveries" on public.deliveries;
drop policy if exists "Authenticated admins can write tickets" on public.tickets;
drop policy if exists "Authenticated admins can write promos" on public.promos;
drop policy if exists "Authenticated admins can write landing_settings" on public.landing_settings;
drop policy if exists "Authenticated admins can write about_settings" on public.about_settings;

-- Recreate with anon + authenticated allowed (app-level auth handles actual security)
create policy "Admins can write products" on public.products for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write mitra_sppg" on public.mitra_sppg for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write articles" on public.articles for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write lab_reports" on public.lab_reports for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write orders" on public.orders for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write deliveries" on public.deliveries for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write tickets" on public.tickets for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write promos" on public.promos for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write landing_settings" on public.landing_settings for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));

create policy "Admins can write about_settings" on public.about_settings for all 
  using (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()))
  with check (auth.role() in ('anon', 'authenticated') and exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid()));
