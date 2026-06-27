# SQL & RLS: `messages` (Inquiry/Booking Lead)

## Tujuan

Mendukung PRD v3:

- Guest mengirim inquiry/booking lewat halaman `Guest.jsx`.
- Data masuk ke tabel `messages`.
- Admin bisa membaca `messages`.

## Rekomendasi Admin Access (pilih 2)

Admin melihat berdasarkan `created_by_user_id` (relasi dengan auth/role).

> Catatan: karena proyekmu saat ini belum memakai Supabase Auth untuk admin (masih localStorage dummy), implementasi RLS di bawah memakai `auth.uid()`.

## Skema tabel (contoh)

Silakan sesuaikan nama kolom auth/role bila proyekmu berbeda.

```sql
-- 1) Tabel messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  message_type text not null,

  created_by_user_id uuid,
  created_by_email text,

  name text,
  email text,
  phone text not null,

  event_date date,
  location text,
  guest_count int,

  message text,
  notes text,
  promo_code text,

  created_at timestamptz not null default now()
);

-- 2) Indexes (opsional, untuk performa)
create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_type_idx on public.messages (message_type);
```

## Row Level Security (RLS)

```sql
-- Enable RLS
alter table public.messages enable row level security;

-- Policy: Insert untuk user yang sudah login (admin/guest-purchaser via auth)
-- Jika guest belum login, policy perlu disesuaikan (mis: anon insert terbatas).
create policy "messages_insert_own"
on public.messages
for insert
to authenticated
with check (created_by_user_id = auth.uid());

-- Policy: Admin/User membaca data milik sendiri (created_by_user_id)
create policy "messages_select_own"
on public.messages
for select
to authenticated
using (created_by_user_id = auth.uid());
```

## Perlu Admin Role/Claims

Agar admin bisa melihat semua messages, biasanya pakai policy berbasis role (contoh `user_role`/JWT claim).
Karena kamu memilih nomor 2 (created_by_user_id), policy di atas hanya membuka data milik user yang membuat.

Jika ternyata admin di proyekmu ingin lihat semua, kamu perlu 1 kebijakan tambahan untuk role admin.
