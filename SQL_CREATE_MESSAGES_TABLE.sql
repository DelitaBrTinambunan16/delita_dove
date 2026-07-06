-- ===================================================================
-- SUPABASE RLS SETUP - Messages, Orders, Products, Campaigns Tables
-- Copy & paste ini ke SQL Editor di Supabase Console
-- ===================================================================

-- ===================================================================
-- 1. MESSAGES TABLE (untuk inquiry/lead dari guest)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_type TEXT NOT NULL DEFAULT 'general_inquiry',
  name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  event_date DATE,
  location TEXT,
  guest_count INTEGER,
  message TEXT,
  notes TEXT,
  promo_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS untuk messages: Public can INSERT (tidak perlu auth)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_messages" ON public.messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_authenticated_read_messages" ON public.messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- ===================================================================
-- 2. ORDERS TABLE (untuk booking/pesanan dari guest)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id TEXT UNIQUE,
  product_id BIGINT,
  product_code TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  package_name TEXT,
  event_date DATE,
  guest_count INTEGER,
  location TEXT,
  total_price NUMERIC(15, 2),
  notes TEXT,
  promo_code TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS untuk orders: Public can INSERT
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_authenticated_read_orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- ===================================================================
-- 3. PRODUCTS TABLE (untuk daftar produk/paket)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  price NUMERIC(15, 2),
  stock INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS untuk products: Public can SELECT
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read_products" ON public.products
  FOR SELECT USING (true);

-- Only authenticated can modify
CREATE POLICY "allow_authenticated_modify_products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "allow_authenticated_delete_products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- ===================================================================
-- 4. CAMPAIGNS TABLE (untuk promo dan campaigns)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  campaign_id TEXT UNIQUE,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  participants_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS untuk campaigns: Public can SELECT
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read_campaigns" ON public.campaigns
  FOR SELECT USING (true);

CREATE POLICY "allow_authenticated_modify_campaigns" ON public.campaigns
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===================================================================
-- 5. CUSTOMERS TABLE (untuk data customer - admin only)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  city TEXT,
  loyalty TEXT DEFAULT 'Bronze',
  promo_code TEXT,
  email_subscription BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS untuk customers: Only authenticated (admin)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_authenticated_all_customers" ON public.customers
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ===================================================================
-- Create indexes untuk performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_messages_phone ON public.messages(phone);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON public.campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- ===================================================================
-- DONE! Tables & RLS policies sudah setup
-- ===================================================================
-- Keterangan:
-- - messages & orders: Public INSERT (guest tidak perlu login untuk submit)
-- - products & campaigns: Public READ (everyone bisa lihat)
-- - customers: Authenticated only (admin dashboard)
-- ===================================================================
