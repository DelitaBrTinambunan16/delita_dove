# TODO - Implementasi PRD Landing Page CRM (PRD v1~v3) + Supabase

## Phase 0 — Konfirmasi Arsitektur (berdasarkan repo)

- [x] Landing publik memakai `src/pages/Guest.jsx` di route `/guest`.
- [x] Booking/pesan paket memakai `src/components/GuestOrderForm.jsx` → saat submit sudah insert ke tabel `orders`.
- [x] Inquiry/kontak “Kirim Pesan” di `src/pages/Guest.jsx` belum insert Supabase (masih localStorage).
- [x] PRD v3: gunakan `message_type` (dipilih).

## Phase 1 — PRD Dokumen (wajib buat file PDF)

- [ ] Buat PRD v1 (Landing Page statis CRM) — berisi struktur top/middle/bottom + acceptance criteria.
- [ ] Buat PRD v2 (Dynamic Content Integration) — products + social proof (menggunakan `campaigns`).
- [ ] Buat PRD v3 (Inquiry/Booking System Integration) — message_type + insert ke `messages`.
- [ ] Pastikan setiap PRD ada bagian: "hasil" dan "bukti commit" (format sesuai materi).
- [ ] Generate 3 PDF: `PRD_v1.pdf`, `PRD_v2.pdf`, `PRD_v3.pdf`.

## Phase 2 — Skema Supabase + RLS (SQL DDL)

- [ ] Buat tabel `products` (jika belum ada) dengan kolom minimal untuk landing.
- [ ] Buat tabel `campaigns` (social proof) dengan kolom minimal.
- [ ] Buat tabel `messages` untuk inquiry/booking lead:
  - kolom: `message_type`, `name`, `email`, `phone`, `event_date`, `location`, `guest_count`, `message`, `notes`, `promo_code`, `created_at`.
- [ ] Pastikan `orders` sudah sesuai dengan payload dari `GuestOrderForm`.
- [ ] Buat RLS policy:
  - `products` SELECT untuk publik.
  - `campaigns` SELECT untuk publik.
  - `messages` INSERT untuk publik.

## Phase 3 — Integrasi Frontend (wiring)

- [ ] `src/pages/Guest.jsx`: ganti `handleContactSubmit` agar insert ke `messages` dengan `message_type`.
  - validasi minimal: `phone` wajib.
  - message_type contoh: `general_inquiry`.
- [ ] Pastikan payload field map sesuai skema `messages`.

## Phase 4 — Integrasi Auth Supabase (admin) — sesuai tugas lanjutan

- [ ] Ganti dummy login/register admin agar memakai `supabase.auth.signInWithPassword` dan `supabase.auth.signUp`.
- [ ] Update guard `src/components/RequireAuth.jsx` agar cek session supabase.

## Phase 5 — CRUD Admin (products & customers)

- [ ] Implement CRUD read/write admin untuk `products` dan `customers` (jika diminta pada tugas framework kamu).

## Phase 6 — Testing manual

- [ ] Validasi:
  - Landing guest tidak rusak.
  - Contact form berhasil insert `messages`.
  - GuestOrderForm insert tetap berjalan.
  - Admin auth tidak rusak.
