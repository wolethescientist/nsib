-- =============================================================
-- NSIB Portal — Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================================

-- -------------------------------------------------------
-- 1. USERS TABLE
--    JWT-based auth (no Supabase Auth)
--    Passwords stored as SHA-256 hash (+ nsib_salt)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT          NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  full_name     TEXT          NOT NULL,
  role          TEXT          NOT NULL DEFAULT 'staff'
                              CHECK (role IN ('staff', 'admin', 'viewer')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- -------------------------------------------------------
-- 2. REPORTS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id             UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT          NOT NULL,
  type           TEXT          NOT NULL DEFAULT 'final'
                               CHECK (type IN ('preliminary', 'final', 'interim', 'safety_bulletin')),
  sector         TEXT          NOT NULL
                               CHECK (sector IN ('aviation', 'maritime', 'railway')),
  description    TEXT,
  status         TEXT          NOT NULL DEFAULT 'published'
                               CHECK (status IN ('draft', 'published', 'archived')),
  file_url       TEXT          NOT NULL,
  file_name      TEXT,
  file_size      BIGINT,
  published_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
  uploaded_by    UUID          REFERENCES public.users(id) ON DELETE SET NULL,
  uploader_name  TEXT,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reports_sector_idx       ON public.reports (sector);
CREATE INDEX IF NOT EXISTS reports_status_idx       ON public.reports (status);
CREATE INDEX IF NOT EXISTS reports_published_at_idx ON public.reports (published_at DESC);
CREATE INDEX IF NOT EXISTS reports_uploaded_by_idx  ON public.reports (uploaded_by);

-- -------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- -------------------------------------------------------
ALTER TABLE public.users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "users_allow_register"
  ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "users_allow_login"
  ON public.users FOR SELECT USING (true);

-- Reports: public read for published
CREATE POLICY "reports_public_read"
  ON public.reports FOR SELECT USING (status = 'published');

-- Reports: server-side API routes manage everything
CREATE POLICY "reports_anon_insert"
  ON public.reports FOR INSERT WITH CHECK (true);

CREATE POLICY "reports_anon_update"
  ON public.reports FOR UPDATE USING (true);

CREATE POLICY "reports_anon_delete"
  ON public.reports FOR DELETE USING (true);

-- -------------------------------------------------------
-- 4. AUTO-UPDATE updated_at TRIGGER
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------
-- 5. STORAGE BUCKET — "nsib" (public)
--    The bucket must exist. Run this to set it to public:
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('nsib', 'nsib', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "nsib_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nsib');

CREATE POLICY "nsib_authenticated_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'nsib');

CREATE POLICY "nsib_authenticated_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'nsib');
