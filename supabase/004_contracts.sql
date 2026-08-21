-- 004_contracts.sql
-- Execute no Supabase Dashboard → SQL Editor (após 003_rental_incomes.sql)

DO $$ BEGIN
  CREATE TYPE contract_type AS ENUM ('rent', 'sale');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE contract_source AS ENUM ('linked', 'manual');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  contract_type contract_type NOT NULL,
  contract_source contract_source NOT NULL,
  title TEXT NOT NULL,
  counterparty_name TEXT NOT NULL,
  snapshot JSONB NOT NULL CHECK (jsonb_typeof(snapshot) = 'object'),
  pdf_storage_path TEXT NOT NULL,
  pdf_size_bytes INTEGER,
  idempotency_key TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contracts_user_idempotency_unique UNIQUE (user_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_property_id ON public.contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_generated
  ON public.contracts(user_id, generated_at DESC);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own contracts" ON public.contracts;
CREATE POLICY "Users select own contracts"
  ON public.contracts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users insert own contracts" ON public.contracts;
CREATE POLICY "Users insert own contracts"
  ON public.contracts FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND (
      property_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = property_id
          AND p.user_id = (select auth.uid())
          AND p.deleted_at IS NULL
          AND (
            (contract_type = 'rent' AND p.purpose IN ('rent', 'both'))
            OR (contract_type = 'sale' AND p.purpose IN ('sale', 'both'))
          )
      )
    )
  );

DROP POLICY IF EXISTS "Users update own contracts" ON public.contracts;
CREATE POLICY "Users update own contracts"
  ON public.contracts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users delete own contracts" ON public.contracts;
CREATE POLICY "Users delete own contracts"
  ON public.contracts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Bucket privado para PDFs de contratos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('contracts', 'contracts', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users upload own contract pdfs" ON storage.objects;
CREATE POLICY "Users upload own contract pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

DROP POLICY IF EXISTS "Users read own contract pdfs" ON storage.objects;
CREATE POLICY "Users read own contract pdfs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

DROP POLICY IF EXISTS "Users delete own contract pdfs" ON storage.objects;
CREATE POLICY "Users delete own contract pdfs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );
