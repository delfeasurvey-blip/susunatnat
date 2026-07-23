-- =============================================
-- Fix RLS: allow anon writes (app-level auth handles security)
-- =============================================
-- For anon role: skip admin_profiles check (app has its own login form)
-- For authenticated role: verify user is in admin_profiles

drop policy if exists "Admins can write products" on public.products;
drop policy if exists "Admins can write mitra_sppg" on public.mitra_sppg;
drop policy if exists "Admins can write articles" on public.articles;
drop policy if exists "Admins can write lab_reports" on public.lab_reports;
drop policy if exists "Admins can write orders" on public.orders;
drop policy if exists "Admins can write deliveries" on public.deliveries;
drop policy if exists "Admins can write tickets" on public.tickets;
drop policy if exists "Admins can write promos" on public.promos;
drop policy if exists "Admins can write landing_settings" on public.landing_settings;
drop policy if exists "Admins can write about_settings" on public.about_settings;

create policy "Admins can write products" on public.products for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write mitra_sppg" on public.mitra_sppg for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write articles" on public.articles for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write lab_reports" on public.lab_reports for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write orders" on public.orders for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write deliveries" on public.deliveries for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write tickets" on public.tickets for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write promos" on public.promos for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write landing_settings" on public.landing_settings for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));

create policy "Admins can write about_settings" on public.about_settings for all 
  using (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())))
  with check (auth.role() in ('anon', 'authenticated') and 
    (auth.role() = 'anon' or exists (select 1 from public.admin_profiles where admin_profiles.id = auth.uid())));
