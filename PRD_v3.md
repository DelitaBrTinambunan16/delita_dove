# PRD v3 — Inquiry / Booking System Integration Delita Dove

## 1. Project Overview

- **Project Goal:** Memungkinkan guest memilih paket/produk dan mengirim permintaan konsultasi/booking (lead generation).
- **Target User:** Guest visitor yang tertarik salah satu paket.
- **Success Criteria:** Data lead masuk ke database Supabase dan dapat dilihat admin.

## 2. Technology Stack

- React JS (JSX) + Tailwind CSS + Shadcn UI
- Supabase (Insert)

## 3. Current State

- Booking/pesan paket sudah insert ke tabel `orders` dari `GuestOrderForm`.
- Inquiry/kontak dari `Guest.jsx` masih localStorage.

## 4. Scope of Work

- Dibolehkan:
  - membuat field `message_type`
  - insert lead inquiry ke tabel `messages`
- Tidak boleh:
  - ubah desain secara dramatis
  - menambah payment gateway

## 5. Functional Requirements

### FR-01 Package Selection (Cart/Selection)

- State sederhana menyimpan paket yang dipilih.

### FR-02 Booking Summary

- Ringkasan paket terpilih + estimasi harga.

### FR-03 Checkout / Booking Form

- Form: nama, HP, rencana tanggal acara, notes.

### FR-04 Database Integration

- Booking paket -> (tetap) `orders`.
- Inquiry/kontak -> insert ke `messages` dengan kolom `message_type`.

### FR-05 Success State

- Tampilkan notifikasi sukses.

## 6. Data Source Requirements

- `messages` kolom minimal:
  - `message_type`, `name`, `email`, `phone`, `event_date`, `location`, `guest_count`, `message`, `notes`, `promo_code`, `created_at`.

## 7. AI Agent Safety Rules

- Validasi minimal: phone wajib.
- Tidak perlu autentikasi.
- gunakan toast/alert Shadcn (atau komponen alert existing).

## 8. Acceptance Criteria

- Booking paket: data masuk `orders`.
- Inquiry: data masuk `messages` dengan `message_type`.
- Admin bisa melihat data tersebut.

## 9. Hasil & Bukti Commit

- Lampirkan bukti commit setelah implementasi.
