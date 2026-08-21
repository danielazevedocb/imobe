-- 003_rental_incomes.sql
-- Execute no Supabase Dashboard → SQL Editor (após 002_properties.sql)

DO $$ BEGIN
  CREATE TYPE rental_income_status AS ENUM ('received', 'pending', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.rental_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  reference_month DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  status rental_income_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rental_incomes_property_month_unique UNIQUE (property_id, reference_month)
);

CREATE INDEX IF NOT EXISTS idx_rental_incomes_user_id ON public.rental_incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_rental_incomes_property_id ON public.rental_incomes(property_id);
CREATE INDEX IF NOT EXISTS idx_rental_incomes_property_month
  ON public.rental_incomes(property_id, reference_month DESC);

ALTER TABLE public.rental_incomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own rental incomes" ON public.rental_incomes;
CREATE POLICY "Users select own rental incomes"
  ON public.rental_incomes FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users insert own rental incomes" ON public.rental_incomes;
CREATE POLICY "Users insert own rental incomes"
  ON public.rental_incomes FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
        AND p.user_id = (select auth.uid())
        AND p.deleted_at IS NULL
        AND p.purpose IN ('rent', 'both')
    )
  );

DROP POLICY IF EXISTS "Users update own rental incomes" ON public.rental_incomes;
CREATE POLICY "Users update own rental incomes"
  ON public.rental_incomes FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users delete own rental incomes" ON public.rental_incomes;
CREATE POLICY "Users delete own rental incomes"
  ON public.rental_incomes FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
