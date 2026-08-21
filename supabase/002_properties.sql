-- 002_properties.sql
-- Execute no Supabase Dashboard → SQL Editor (após 001_profiles.sql)

DO $$ BEGIN
  CREATE TYPE property_purpose AS ENUM ('rent', 'sale', 'both');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('apartment', 'house', 'commercial', 'land', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type property_type NOT NULL,
  address_street TEXT NOT NULL,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  listing_url TEXT,
  estimated_value NUMERIC(14,2),
  iptu_value NUMERIC(14,2),
  purpose property_purpose NOT NULL,
  rent_value NUMERIC(14,2),
  sale_value NUMERIC(14,2),
  rent_available BOOLEAN DEFAULT true,
  sale_available BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_user_active ON public.properties(user_id) WHERE deleted_at IS NULL;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own properties" ON public.properties;
CREATE POLICY "Users select own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own properties" ON public.properties;
CREATE POLICY "Users insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own properties" ON public.properties;
CREATE POLICY "Users update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own properties" ON public.properties;
CREATE POLICY "Users delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);
