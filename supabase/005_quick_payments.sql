-- 005_quick_payments.sql
-- Execute no Supabase Dashboard → SQL Editor (após 004_contracts.sql)

CREATE TABLE IF NOT EXISTS public.rental_payment_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_key TEXT NOT NULL,
  rental_income_id UUID NOT NULL REFERENCES public.rental_incomes(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  reference_month DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rental_payment_operations_user_key_unique UNIQUE (user_id, operation_key)
);

CREATE INDEX IF NOT EXISTS idx_rental_payment_operations_user_id
  ON public.rental_payment_operations(user_id);

ALTER TABLE public.rental_payment_operations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own rental payment operations" ON public.rental_payment_operations;
CREATE POLICY "Users select own rental payment operations"
  ON public.rental_payment_operations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION public.get_rental_competency_status(
  p_property_id UUID,
  p_reference_month TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_property RECORD;
  v_reference_month DATE;
  v_income RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  IF p_reference_month !~ '^\d{4}-(0[1-9]|1[0-2])$' THEN
    RETURN jsonb_build_object('status', 'invalid_month');
  END IF;

  v_reference_month := (p_reference_month || '-01')::DATE;

  SELECT id, purpose, deleted_at, rent_value
  INTO v_property
  FROM public.properties
  WHERE id = p_property_id
    AND user_id = v_user_id
  FOR SHARE;

  IF NOT FOUND OR v_property.deleted_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'property_ineligible');
  END IF;

  IF v_property.purpose = 'sale' THEN
    RETURN jsonb_build_object('status', 'property_ineligible');
  END IF;

  SELECT id, amount, status, updated_at
  INTO v_income
  FROM public.rental_incomes
  WHERE property_id = p_property_id
    AND reference_month = v_reference_month
    AND user_id = v_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'free',
      'suggested_amount', v_property.rent_value
    );
  END IF;

  RETURN jsonb_build_object(
    'status', v_income.status::TEXT,
    'income_id', v_income.id,
    'amount', v_income.amount,
    'updated_at', v_income.updated_at,
    'suggested_amount', v_income.amount
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.commit_quick_rental_payment(
  p_operation_key TEXT,
  p_property_id UUID,
  p_reference_month TEXT,
  p_amount NUMERIC,
  p_confirm_update BOOLEAN DEFAULT FALSE,
  p_expected_income_id UUID DEFAULT NULL,
  p_expected_status TEXT DEFAULT NULL,
  p_expected_amount NUMERIC DEFAULT NULL,
  p_expected_updated_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_property RECORD;
  v_reference_month DATE;
  v_income RECORD;
  v_existing_operation RECORD;
  v_income_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  IF p_operation_key IS NULL OR length(trim(p_operation_key)) = 0 THEN
    RETURN jsonb_build_object('status', 'invalid_operation');
  END IF;

  IF p_reference_month !~ '^\d{4}-(0[1-9]|1[0-2])$' THEN
    RETURN jsonb_build_object('status', 'invalid_month');
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 999999999999.99 THEN
    RETURN jsonb_build_object('status', 'invalid_amount');
  END IF;

  v_reference_month := (p_reference_month || '-01')::DATE;

  SELECT *
  INTO v_existing_operation
  FROM public.rental_payment_operations
  WHERE user_id = v_user_id
    AND operation_key = p_operation_key;

  IF FOUND THEN
    SELECT id, amount, status, updated_at, property_id, reference_month
    INTO v_income
    FROM public.rental_incomes
    WHERE id = v_existing_operation.rental_income_id
      AND user_id = v_user_id;

    RETURN jsonb_build_object(
      'status', 'committed',
      'income_id', v_income.id,
      'amount', v_income.amount,
      'income_status', v_income.status,
      'property_id', v_income.property_id,
      'reference_month', to_char(v_income.reference_month, 'YYYY-MM')
    );
  END IF;

  SELECT id, purpose, deleted_at
  INTO v_property
  FROM public.properties
  WHERE id = p_property_id
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND OR v_property.deleted_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'property_ineligible');
  END IF;

  IF v_property.purpose = 'sale' THEN
    RETURN jsonb_build_object('status', 'property_ineligible');
  END IF;

  SELECT id, amount, status, updated_at
  INTO v_income
  FROM public.rental_incomes
  WHERE property_id = p_property_id
    AND reference_month = v_reference_month
    AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.rental_incomes (
      user_id,
      property_id,
      reference_month,
      amount,
      status,
      updated_at
    )
    VALUES (
      v_user_id,
      p_property_id,
      v_reference_month,
      p_amount,
      'received',
      now()
    )
    RETURNING id INTO v_income_id;

    INSERT INTO public.rental_payment_operations (
      user_id,
      operation_key,
      rental_income_id,
      property_id,
      reference_month,
      amount
    )
    VALUES (
      v_user_id,
      p_operation_key,
      v_income_id,
      p_property_id,
      v_reference_month,
      p_amount
    );

    RETURN jsonb_build_object(
      'status', 'committed',
      'income_id', v_income_id,
      'amount', p_amount,
      'income_status', 'received',
      'property_id', p_property_id,
      'reference_month', p_reference_month
    );
  END IF;

  IF v_income.status = 'received' THEN
    RETURN jsonb_build_object(
      'status', 'already_received',
      'income_id', v_income.id,
      'amount', v_income.amount,
      'reference_month', p_reference_month
    );
  END IF;

  IF NOT p_confirm_update THEN
    RETURN jsonb_build_object(
      'status', 'needs_confirmation',
      'income_id', v_income.id,
      'amount', v_income.amount,
      'income_status', v_income.status,
      'reference_month', p_reference_month
    );
  END IF;

  IF p_expected_income_id IS NULL
    OR p_expected_income_id <> v_income.id
    OR p_expected_status IS NULL
    OR p_expected_status <> v_income.status::TEXT
    OR p_expected_amount IS NULL
    OR p_expected_amount <> v_income.amount
    OR p_expected_updated_at IS NULL
    OR p_expected_updated_at <> v_income.updated_at THEN
    RETURN jsonb_build_object(
      'status', 'conflict_changed',
      'income_id', v_income.id,
      'amount', v_income.amount,
      'income_status', v_income.status,
      'updated_at', v_income.updated_at,
      'reference_month', p_reference_month
    );
  END IF;

  UPDATE public.rental_incomes
  SET
    amount = p_amount,
    status = 'received',
    updated_at = now()
  WHERE id = v_income.id
    AND user_id = v_user_id
  RETURNING id INTO v_income_id;

  INSERT INTO public.rental_payment_operations (
    user_id,
    operation_key,
    rental_income_id,
    property_id,
    reference_month,
    amount
  )
  VALUES (
    v_user_id,
    p_operation_key,
    v_income_id,
    p_property_id,
    v_reference_month,
    p_amount
  );

  RETURN jsonb_build_object(
    'status', 'committed',
    'income_id', v_income_id,
    'amount', p_amount,
    'income_status', 'received',
    'property_id', p_property_id,
    'reference_month', p_reference_month
  );
EXCEPTION
  WHEN unique_violation THEN
    SELECT *
    INTO v_existing_operation
    FROM public.rental_payment_operations
    WHERE user_id = v_user_id
      AND operation_key = p_operation_key;

    IF FOUND THEN
      SELECT id, amount, status, property_id, reference_month
      INTO v_income
      FROM public.rental_incomes
      WHERE id = v_existing_operation.rental_income_id
        AND user_id = v_user_id;

      RETURN jsonb_build_object(
        'status', 'committed',
        'income_id', v_income.id,
        'amount', v_income.amount,
        'income_status', v_income.status,
        'property_id', v_income.property_id,
        'reference_month', to_char(v_income.reference_month, 'YYYY-MM')
      );
    END IF;

    RETURN jsonb_build_object('status', 'conflict_changed');
END;
$$;

REVOKE ALL ON FUNCTION public.get_rental_competency_status(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.commit_quick_rental_payment(
  TEXT, UUID, TEXT, NUMERIC, BOOLEAN, UUID, TEXT, NUMERIC, TIMESTAMPTZ
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_rental_competency_status(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.commit_quick_rental_payment(
  TEXT, UUID, TEXT, NUMERIC, BOOLEAN, UUID, TEXT, NUMERIC, TIMESTAMPTZ
) TO authenticated;
