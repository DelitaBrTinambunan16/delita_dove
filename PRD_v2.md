# PRD v2 — Landing Page Home (Dynamic Content Integration) Delita Dove

## 1. Project Overview

- **Project Goal:** Mengubah konten Area Middle pada Landing Page Delita Dove menjadi **dinamis** dari Supabase.
- **Target User:** Guest visitor yang ingin melihat paket beserta harga real-time.
- **Success Criteria:** Paket baru/updates yang ditambahkan admin di `/admin/products` langsung muncul pada landing tanpa perubahan frontend.

## 2. Technology Stack

- React JS (JSX) + Tailwind CSS + Shadcn UI
- Supabase (supabase-js)

## 3. Current State

- Landing layout sudah ada.
- Daftar paket/harga/portfolio masih hardcoded.

## 4. Scope of Work

- **Allowed:** fetching data products + mengganti mock data.
- **Not Allowed:** merubah desain secara dramatis.

## 5. Functional Requirements

### FR-01 Dynamic Product/Package Section

- Fetch tabel **`products`**.
- Card yang ditampilkan: title, category, price, brand.

### FR-02 Product Highlight Carousel

- Carousel menampilkan paket unggulan.
- Next/Prev berjalan.

### FR-03 Dynamic Portfolio / Campaign

- Ambil social proof dari tabel **`campaigns`** (sesuai repository).

### FR-04 Error Handling & Loading State

- Skeleton loader Shadcn UI saat fetch.
- Error state bila fetch gagal.

## 6. Data Source Requirements

- Query Supabase disesuaikan dengan skema products: `id`, `code`, `title`, `category`, `brand`, `price`, `stock`.

## 7. AI Agent Safety Rules

- Hindari query berulang.
- Fokus Read Only untuk publik.

## 8. Acceptance Criteria

- Produk/paket tampil real-time dari Supabase.
- Carousel berjalan normal.
- Loading state muncul saat fetching.

## 9. Hasil & Bukti Commit

- Lampirkan hasil + link commit setelah implementasi.
