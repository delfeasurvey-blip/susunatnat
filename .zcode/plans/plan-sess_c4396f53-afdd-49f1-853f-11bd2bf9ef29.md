# Rencana Perbaikan Website NatNat Fresh Milk

## Part 1 — Quick Fixes (Code Quality)

### 1. Hapus duplikasi `isSupabaseConfigured` di App.tsx
- Import dari `supabase.ts` instead of redefining inline (baris 77-82)

### 2. Pindah passcode admin ke `.env`
- Tambah `VITE_ADMIN_PASSCODE` ke `.env.example`
- Ganti hardcoded `'admin'` di AdminPanel.tsx → `import.meta.env.VITE_ADMIN_PASSCODE || 'admin'`

### 3. Ganti `Date.now()` IDs → `crypto.randomUUID()`
- **db.ts**: 7 lokasi (`prod-`, `mitra-`, `art-`, `lab-`, `TRK-`, `TCK-`, `promo-`)
- **AdminPanel.tsx**: 5 lokasi (prefiks yang sama)
- Update signature insert functions di db.ts untuk accept optional `id`

### 4. Hapus unused `useDBSync` hook
- Hapus `src/hooks/useDBSync.ts`
- Ganti semua `syncXxx()` calls di AdminPanel.tsx → direct calls ke `db.ts` functions
- Tambah import untuk db.ts functions di AdminPanel.tsx

## Part 2 — Supabase Auth + RLS (Security Overhaul)

### 5. Buat migration `supabase/migrations/002_auth_setup.sql`
- Tabel `admin_profiles` (linked ke `auth.users` via uuid)
- Drop policy write lama (allow anon), ganti dengan:
  - **Read**: tetap public (anon + authenticated)
  - **Write**: hanya `authenticated` yang ada di `admin_profiles`
- Policies untuk `admin_profiles`:
  - `anon` bisa SELECT (untuk cek admin status)
  - `authenticated` bisa INSERT/DELETE (manage admins)

### 6. Buat `src/lib/auth.ts`
- `loginWithEmail(email, password)` — Supabase Auth signIn
- `registerFirstAdmin(email, password)` — signUp + auto-add ke admin_profiles jika table kosong
- `logout()` — signOut
- `isAdmin()` — cek auth.user + admin_profiles
- `getCurrentUser()` — dapatkan user yang sedang login

### 7. Refactor AdminPanel login
- Ganti form passcode-only → tabbed login:
  - **Tab "Masuk"**: Email + password (Supabase Auth)
  - **Tab "Daftar"**: Register admin pertama (dengan validasi admin_profiles kosong)
  - **Tombol "Akses Darurat"**: fallback ke passcode `.env` (jika Supabase Auth gagal)
- Setelah login sukses → verify user ada di `admin_profiles`
- Session management: listen ke `supabase.auth.onAuthStateChange`

## Flow Login Admin (Baru)
```
┌─────────────────────────────────────┐
│  Portal Admin NatNat                │
│  ┌─ Tab: Masuk ─────────────────┐  │
│  │ Email: [____]                │  │
│  │ Password: [____]             │  │
│  │ [Masuk]                      │  │
│  └──────────────────────────────┘  │
│  ┌─ Tab: Daftar ────────────────┐  │
│  │ Email: [____]                │  │
│  │ Password: [____]             │  │
│  │ [Daftar Admin Pertama]       │  │
│  └──────────────────────────────┘  │
│  [🔑 Akses Darurat - Passcode]     │
└─────────────────────────────────────┘
```

## Setup Steps untuk User
Setelah kode di-deploy:
1. Jalankan migration 002 di Supabase Dashboard → SQL Editor
2. Buat admin pertama via Supabase Dashboard → Authentication → Create User
3. Atau via tombol "Daftar Admin Pertama" di aplikasi
4. Set `VITE_ADMIN_PASSCODE` di Vercel Dashboard → Environment Variables
5. Set `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Vercel