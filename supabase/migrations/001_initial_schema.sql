-- =============================================
-- NatNat Fresh Milk - Supabase Database Schema
-- =============================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- Table: products
-- =============================================
create table public.products (
  id text primary key,
  name text not null,
  type text not null check (type in ('Pasteurisasi', 'UHT', 'Steril')),
  volume text not null,
  packaging text not null,
  price integer not null,
  target_audience text not null,
  nutrients jsonb not null default '{}',
  description text not null default '',
  certifications text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: mitra_sppg
-- =============================================
create table public.mitra_sppg (
  id text primary key,
  name text not null,
  location text not null,
  address text not null,
  coordinator text not null,
  phone text not null,
  beneficiaries_count integer not null default 0,
  daily_quota integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: articles
-- =============================================
create table public.articles (
  id text primary key,
  title text not null,
  summary text not null,
  content text not null,
  category text not null check (category in ('Gizi', 'SOP Distribusi', 'Siaran Pers')),
  date date not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: lab_reports
-- =============================================
create table public.lab_reports (
  id text primary key,
  batch_no text not null,
  test_date date not null,
  bacteria_count text not null,
  fat_content text not null,
  protein_content text not null,
  sensory_test text not null check (sensory_test in ('Sesuai Standar', 'Tidak Sesuai')),
  status text not null check (status in ('Lulus Uji', 'Gagal Uji')),
  certified_by text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: orders
-- =============================================
create table public.orders (
  id text primary key,
  mitra_id text not null,
  mitra_name text not null,
  product_name text not null,
  quantity integer not null,
  delivery_date date not null,
  status text not null check (status in ('Dipesan', 'Dalam Perjalanan', 'Selesai', 'Dibatalkan')),
  order_date date not null,
  notes text,
  signed_by text,
  signature_data text,
  received_date text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: deliveries
-- =============================================
create table public.deliveries (
  id text primary key,
  order_id text not null,
  driver_name text not null,
  vehicle_no text not null,
  departure_time text not null,
  status text not null check (status in ('Dalam Perjalanan', 'Selesai', 'Kendala')),
  current_temp numeric not null,
  temp_history jsonb not null default '[]',
  route_coordinates jsonb not null default '[]',
  current_step_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: tickets
-- =============================================
create table public.tickets (
  id text primary key,
  mitra_id text not null,
  mitra_name text not null,
  type text not null check (type in ('Kemasan Rusak', 'Rasa Masam / Basi', 'Suhu Rantai Dingin Naik', 'Keterlambatan', 'Lainnya')),
  description text not null,
  date date not null,
  status text not null check (status in ('Baru', 'Diproses QC', 'Selesai', 'Ditolak')),
  resolution text,
  severity text not null check (severity in ('Rendah', 'Sedang', 'Tinggi', 'Kritis')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: promos
-- =============================================
create table public.promos (
  id text primary key,
  title text not null,
  description text not null,
  media_type text not null check (media_type in ('image', 'video')),
  media_url text not null,
  link_url text,
  button_text text,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- Table: landing_settings (singleton - 1 row only)
-- =============================================
create table public.landing_settings (
  id integer primary key default 1,
  hero_title text not null,
  hero_subtitle text not null,
  campaign_title text not null,
  campaign_slogan text not null,
  campaign_desc text not null,
  mitra_count text not null,
  peternak_count text not null,
  freezer_title text not null,
  freezer_desc text not null,
  whatsapp_number text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint landing_settings_singleton unique (id)
);

-- =============================================
-- Table: about_settings (singleton - 1 row only)
-- =============================================
create table public.about_settings (
  id integer primary key default 1,
  profil_title text not null,
  profil_desc text not null,
  capacity_title text not null,
  capacity_value text not null,
  capacity_desc text not null,
  hygiene_value text not null,
  sourcing_value text not null,
  visi_title text not null,
  visi_desc text not null,
  misi_list jsonb not null default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint about_settings_singleton unique (id)
);

-- =============================================
-- Enable Row Level Security
-- =============================================
alter table public.products enable row level security;
alter table public.mitra_sppg enable row level security;
alter table public.articles enable row level security;
alter table public.lab_reports enable row level security;
alter table public.orders enable row level security;
alter table public.deliveries enable row level security;
alter table public.tickets enable row level security;
alter table public.promos enable row level security;
alter table public.landing_settings enable row level security;
alter table public.about_settings enable row level security;

-- =============================================
-- RLS Policies: Public read, authenticated write
-- =============================================

-- Products: anyone can read, authenticated can write
create policy "Public read products" on public.products for select using (true);
create policy "Authenticated write products" on public.products for all using (auth.role() = 'authenticated');

-- Mitra SPPG: anyone can read, authenticated can write
create policy "Public read mitra_sppg" on public.mitra_sppg for select using (true);
create policy "Authenticated write mitra_sppg" on public.mitra_sppg for all using (auth.role() = 'authenticated');

-- Articles: anyone can read, authenticated can write
create policy "Public read articles" on public.articles for select using (true);
create policy "Authenticated write articles" on public.articles for all using (auth.role() = 'authenticated');

-- Lab Reports: anyone can read, authenticated can write
create policy "Public read lab_reports" on public.lab_reports for select using (true);
create policy "Authenticated write lab_reports" on public.lab_reports for all using (auth.role() = 'authenticated');

-- Orders: anyone can read, authenticated can write
create policy "Public read orders" on public.orders for select using (true);
create policy "Authenticated write orders" on public.orders for all using (auth.role() = 'authenticated');

-- Deliveries: anyone can read, authenticated can write
create policy "Public read deliveries" on public.deliveries for select using (true);
create policy "Authenticated write deliveries" on public.deliveries for all using (auth.role() = 'authenticated');

-- Tickets: anyone can read, authenticated can write
create policy "Public read tickets" on public.tickets for select using (true);
create policy "Authenticated write tickets" on public.tickets for all using (auth.role() = 'authenticated');

-- Promos: anyone can read, authenticated can write
create policy "Public read promos" on public.promos for select using (true);
create policy "Authenticated write promos" on public.promos for all using (auth.role() = 'authenticated');

-- Landing Settings: anyone can read, authenticated can write
create policy "Public read landing_settings" on public.landing_settings for select using (true);
create policy "Authenticated write landing_settings" on public.landing_settings for all using (auth.role() = 'authenticated');

-- About Settings: anyone can read, authenticated can write
create policy "Public read about_settings" on public.about_settings for select using (true);
create policy "Authenticated write about_settings" on public.about_settings for all using (auth.role() = 'authenticated');
