-- 007_property_photos.sql
-- Execute no Supabase Dashboard → SQL Editor (após 006_profile_contacts.sql)

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS photo_collection_version INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.property_photo_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_key TEXT NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('create', 'update')),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'prepared' CHECK (status IN ('prepared', 'committed', 'failed')),
  property_payload JSONB,
  photo_manifest JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  committed_at TIMESTAMPTZ,
  CONSTRAINT property_photo_operations_user_key_unique UNIQUE (user_id, operation_key)
);

CREATE TABLE IF NOT EXISTS public.property_photo_staging (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_id UUID NOT NULL REFERENCES public.property_photo_operations(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/png', 'image/jpeg')),
  size_bytes INTEGER NOT NULL CHECK (size_bytes BETWEEN 1 AND 3000000),
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT property_photo_staging_operation_path_unique UNIQUE (operation_id, storage_path)
);

CREATE TABLE IF NOT EXISTS public.property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/png', 'image/jpeg')),
  size_bytes INTEGER NOT NULL CHECK (size_bytes BETWEEN 1 AND 3000000),
  sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT property_photos_property_sort_unique UNIQUE (property_id, sort_order),
  CONSTRAINT property_photos_property_path_unique UNIQUE (property_id, storage_path)
);

CREATE INDEX IF NOT EXISTS idx_property_photo_operations_user_id
  ON public.property_photo_operations(user_id);

CREATE INDEX IF NOT EXISTS idx_property_photo_staging_operation_id
  ON public.property_photo_staging(operation_id);

CREATE INDEX IF NOT EXISTS idx_property_photos_property_id
  ON public.property_photos(property_id, sort_order);

ALTER TABLE public.property_photo_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photo_staging ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own property photo operations" ON public.property_photo_operations;
CREATE POLICY "Users select own property photo operations"
  ON public.property_photo_operations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users insert own property photo operations" ON public.property_photo_operations;
CREATE POLICY "Users insert own property photo operations"
  ON public.property_photo_operations FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users update own property photo operations" ON public.property_photo_operations;
CREATE POLICY "Users update own property photo operations"
  ON public.property_photo_operations FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users select own property photo staging" ON public.property_photo_staging;
CREATE POLICY "Users select own property photo staging"
  ON public.property_photo_staging FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users insert own property photo staging" ON public.property_photo_staging;
CREATE POLICY "Users insert own property photo staging"
  ON public.property_photo_staging FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users delete own property photo staging" ON public.property_photo_staging;
CREATE POLICY "Users delete own property photo staging"
  ON public.property_photo_staging FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users select own property photos" ON public.property_photos;
CREATE POLICY "Users select own property photos"
  ON public.property_photos FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users insert own property photos" ON public.property_photos;
CREATE POLICY "Users insert own property photos"
  ON public.property_photos FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users update own property photos" ON public.property_photos;
CREATE POLICY "Users update own property photos"
  ON public.property_photos FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users delete own property photos" ON public.property_photos;
CREATE POLICY "Users delete own property photos"
  ON public.property_photos FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  false,
  3000000,
  ARRAY['image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users upload own property photo staging" ON storage.objects;
CREATE POLICY "Users upload own property photo staging"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
    AND (storage.foldername(name))[2] = 'staging'
  );

-- Permite copiar/mover o arquivo para o caminho confirmado após o commit.
DROP POLICY IF EXISTS "Users upload own confirmed property photos" ON storage.objects;
CREATE POLICY "Users upload own confirmed property photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
    AND (storage.foldername(name))[2] = 'properties'
  );

DROP POLICY IF EXISTS "Users read own property photo staging objects" ON storage.objects;
CREATE POLICY "Users read own property photo staging objects"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
    AND (storage.foldername(name))[2] = 'staging'
  );

DROP POLICY IF EXISTS "Users read own confirmed property photos" ON storage.objects;
CREATE POLICY "Users read own confirmed property photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
    AND (storage.foldername(name))[2] = 'properties'
    AND EXISTS (
      SELECT 1
      FROM public.property_photos pp
      WHERE pp.user_id = (select auth.uid())
        AND pp.storage_path = name
    )
  );

DROP POLICY IF EXISTS "Users read own property photos by metadata path" ON storage.objects;
CREATE POLICY "Users read own property photos by metadata path"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
    AND EXISTS (
      SELECT 1
      FROM public.property_photos pp
      WHERE pp.user_id = (select auth.uid())
        AND pp.storage_path = name
    )
  );

DROP POLICY IF EXISTS "Users update own property photo objects" ON storage.objects;
CREATE POLICY "Users update own property photo objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

DROP POLICY IF EXISTS "Users delete own property photo objects" ON storage.objects;
CREATE POLICY "Users delete own property photo objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-photos'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

CREATE OR REPLACE FUNCTION public.prepare_property_photo_operation(
  p_operation_key TEXT,
  p_operation_type TEXT,
  p_property_id UUID DEFAULT NULL,
  p_property_payload JSONB DEFAULT NULL,
  p_photo_manifest JSONB DEFAULT '[]'::JSONB,
  p_expected_photo_version INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_existing RECORD;
  v_operation_id UUID;
  v_property RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  IF p_operation_type NOT IN ('create', 'update') THEN
    RETURN jsonb_build_object('status', 'invalid_operation_type');
  END IF;

  SELECT *
  INTO v_existing
  FROM public.property_photo_operations
  WHERE user_id = v_user_id
    AND operation_key = p_operation_key;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'status', 'prepared',
      'operation_id', v_existing.id,
      'operation_type', v_existing.operation_type,
      'property_id', v_existing.property_id,
      'photo_manifest', v_existing.photo_manifest
    );
  END IF;

  IF p_operation_type = 'update' THEN
    SELECT id, photo_collection_version, deleted_at
    INTO v_property
    FROM public.properties
    WHERE id = p_property_id
      AND user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND OR v_property.deleted_at IS NOT NULL THEN
      RETURN jsonb_build_object('status', 'property_not_found');
    END IF;

    IF p_expected_photo_version IS NULL
      OR p_expected_photo_version <> v_property.photo_collection_version THEN
      RETURN jsonb_build_object(
        'status', 'conflict_version',
        'photo_collection_version', v_property.photo_collection_version
      );
    END IF;
  END IF;

  INSERT INTO public.property_photo_operations (
    user_id,
    operation_key,
    operation_type,
    property_id,
    property_payload,
    photo_manifest,
    updated_at
  )
  VALUES (
    v_user_id,
    p_operation_key,
    p_operation_type,
    p_property_id,
    p_property_payload,
    COALESCE(p_photo_manifest, '[]'::JSONB),
    now()
  )
  RETURNING id INTO v_operation_id;

  RETURN jsonb_build_object(
    'status', 'prepared',
    'operation_id', v_operation_id,
    'operation_type', p_operation_type,
    'property_id', p_property_id,
    'photo_manifest', COALESCE(p_photo_manifest, '[]'::JSONB)
  );
EXCEPTION
  WHEN unique_violation THEN
    SELECT *
    INTO v_existing
    FROM public.property_photo_operations
    WHERE user_id = v_user_id
      AND operation_key = p_operation_key;

    RETURN jsonb_build_object(
      'status', 'prepared',
      'operation_id', v_existing.id,
      'operation_type', v_existing.operation_type,
      'property_id', v_existing.property_id,
      'photo_manifest', v_existing.photo_manifest
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.register_property_photo_staging(
  p_operation_id UUID,
  p_storage_path TEXT,
  p_original_name TEXT,
  p_mime_type TEXT,
  p_size_bytes INTEGER,
  p_checksum TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_operation RECORD;
  v_staging_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  SELECT *
  INTO v_operation
  FROM public.property_photo_operations
  WHERE id = p_operation_id
    AND user_id = v_user_id
    AND status = 'prepared'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'operation_not_found');
  END IF;

  SELECT COUNT(*)
  INTO v_staging_count
  FROM public.property_photo_staging
  WHERE operation_id = p_operation_id;

  IF v_staging_count >= 10 THEN
    RETURN jsonb_build_object('status', 'photo_limit_exceeded');
  END IF;

  INSERT INTO public.property_photo_staging (
    user_id,
    operation_id,
    storage_path,
    original_name,
    mime_type,
    size_bytes,
    checksum
  )
  VALUES (
    v_user_id,
    p_operation_id,
    p_storage_path,
    p_original_name,
    p_mime_type,
    p_size_bytes,
    p_checksum
  );

  RETURN jsonb_build_object('status', 'registered');
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('status', 'duplicate_staging');
END;
$$;

CREATE OR REPLACE FUNCTION public.commit_property_create_with_photos(
  p_operation_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_operation RECORD;
  v_property_id UUID;
  v_payload JSONB;
  v_staging RECORD;
  v_sort_order INTEGER := 0;
  v_photo_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  SELECT *
  INTO v_operation
  FROM public.property_photo_operations
  WHERE user_id = v_user_id
    AND operation_key = p_operation_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'operation_not_found');
  END IF;

  IF v_operation.status = 'committed' AND v_operation.property_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'status', 'committed',
      'property_id', v_operation.property_id
    );
  END IF;

  IF v_operation.operation_type <> 'create' OR v_operation.property_payload IS NULL THEN
    RETURN jsonb_build_object('status', 'invalid_operation');
  END IF;

  v_payload := v_operation.property_payload;

  SELECT COUNT(*)
  INTO v_photo_count
  FROM public.property_photo_staging
  WHERE operation_id = v_operation.id;

  IF v_photo_count > 10 THEN
    RETURN jsonb_build_object('status', 'photo_limit_exceeded');
  END IF;

  INSERT INTO public.properties (
    user_id,
    type,
    address_street,
    address_number,
    address_complement,
    neighborhood,
    city,
    location,
    listing_url,
    estimated_value,
    iptu_value,
    purpose,
    rent_value,
    sale_value,
    rent_available,
    sale_available,
    photo_collection_version,
    updated_at
  )
  VALUES (
    v_user_id,
    (v_payload->>'type')::property_type,
    v_payload->>'address_street',
    NULLIF(v_payload->>'address_number', ''),
    NULLIF(v_payload->>'address_complement', ''),
    v_payload->>'neighborhood',
    v_payload->>'city',
    v_payload->>'location',
    NULLIF(v_payload->>'listing_url', ''),
    NULLIF(v_payload->>'estimated_value', '')::NUMERIC,
    NULLIF(v_payload->>'iptu_value', '')::NUMERIC,
    (v_payload->>'purpose')::property_purpose,
    NULLIF(v_payload->>'rent_value', '')::NUMERIC,
    NULLIF(v_payload->>'sale_value', '')::NUMERIC,
    COALESCE((v_payload->>'rent_available')::BOOLEAN, false),
    COALESCE((v_payload->>'sale_available')::BOOLEAN, false),
    1,
    now()
  )
  RETURNING id INTO v_property_id;

  FOR v_staging IN
    SELECT *
    FROM public.property_photo_staging
    WHERE operation_id = v_operation.id
    ORDER BY created_at ASC
  LOOP
    INSERT INTO public.property_photos (
      user_id,
      property_id,
      storage_path,
      original_name,
      mime_type,
      size_bytes,
      sort_order,
      checksum,
      updated_at
    )
    VALUES (
      v_user_id,
      v_property_id,
      replace(
        v_staging.storage_path,
        '/staging/',
        '/properties/' || v_property_id::TEXT || '/'
      ),
      v_staging.original_name,
      v_staging.mime_type,
      v_staging.size_bytes,
      v_sort_order,
      v_staging.checksum,
      now()
    );

    v_sort_order := v_sort_order + 1;
  END LOOP;

  UPDATE public.property_photo_operations
  SET
    status = 'committed',
    property_id = v_property_id,
    committed_at = now(),
    updated_at = now()
  WHERE id = v_operation.id;

  DELETE FROM public.property_photo_staging
  WHERE operation_id = v_operation.id;

  RETURN jsonb_build_object(
    'status', 'committed',
    'property_id', v_property_id,
    'photo_count', v_sort_order
  );
EXCEPTION
  WHEN unique_violation THEN
    SELECT property_id
    INTO v_property_id
    FROM public.property_photo_operations
    WHERE user_id = v_user_id
      AND operation_key = p_operation_key;

    RETURN jsonb_build_object(
      'status', 'committed',
      'property_id', v_property_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.commit_property_update_with_photos(
  p_operation_key TEXT,
  p_expected_photo_version INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_operation RECORD;
  v_property RECORD;
  v_payload JSONB;
  v_manifest JSONB;
  v_item JSONB;
  v_kept_count INTEGER := 0;
  v_new_count INTEGER := 0;
  v_sort_order INTEGER := 0;
  v_staging RECORD;
  v_photo_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  SELECT *
  INTO v_operation
  FROM public.property_photo_operations
  WHERE user_id = v_user_id
    AND operation_key = p_operation_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'operation_not_found');
  END IF;

  IF v_operation.status = 'committed' THEN
    RETURN jsonb_build_object(
      'status', 'committed',
      'property_id', v_operation.property_id,
      'photo_collection_version', p_expected_photo_version
    );
  END IF;

  IF v_operation.operation_type <> 'update'
    OR v_operation.property_id IS NULL
    OR v_operation.property_payload IS NULL THEN
    RETURN jsonb_build_object('status', 'invalid_operation');
  END IF;

  SELECT *
  INTO v_property
  FROM public.properties
  WHERE id = v_operation.property_id
    AND user_id = v_user_id
    AND deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'property_not_found');
  END IF;

  IF p_expected_photo_version <> v_property.photo_collection_version THEN
    RETURN jsonb_build_object(
      'status', 'conflict_version',
      'photo_collection_version', v_property.photo_collection_version
    );
  END IF;

  v_payload := v_operation.property_payload;
  v_manifest := COALESCE(v_operation.photo_manifest, '[]'::JSONB);

  UPDATE public.properties
  SET
    type = (v_payload->>'type')::property_type,
    address_street = v_payload->>'address_street',
    address_number = NULLIF(v_payload->>'address_number', ''),
    address_complement = NULLIF(v_payload->>'address_complement', ''),
    neighborhood = v_payload->>'neighborhood',
    city = v_payload->>'city',
    location = v_payload->>'location',
    listing_url = NULLIF(v_payload->>'listing_url', ''),
    estimated_value = NULLIF(v_payload->>'estimated_value', '')::NUMERIC,
    iptu_value = NULLIF(v_payload->>'iptu_value', '')::NUMERIC,
    purpose = (v_payload->>'purpose')::property_purpose,
    rent_value = NULLIF(v_payload->>'rent_value', '')::NUMERIC,
    sale_value = NULLIF(v_payload->>'sale_value', '')::NUMERIC,
    rent_available = COALESCE((v_payload->>'rent_available')::BOOLEAN, false),
    sale_available = COALESCE((v_payload->>'sale_available')::BOOLEAN, false),
    updated_at = now()
  WHERE id = v_property.id;

  DELETE FROM public.property_photos
  WHERE property_id = v_property.id
    AND id NOT IN (
      SELECT (value->>'photo_id')::UUID
      FROM jsonb_array_elements(v_manifest)
      WHERE value->>'kind' = 'keep'
        AND value ? 'photo_id'
    );

  FOR v_item IN
    SELECT value
    FROM jsonb_array_elements(v_manifest)
    WHERE value->>'kind' = 'keep'
    ORDER BY COALESCE((value->>'sort_order')::INTEGER, 0)
  LOOP
    v_photo_id := (v_item->>'photo_id')::UUID;

    IF NOT EXISTS (
      SELECT 1
      FROM public.property_photos
      WHERE id = v_photo_id
        AND property_id = v_property.id
        AND user_id = v_user_id
    ) THEN
      RETURN jsonb_build_object('status', 'conflict_photos');
    END IF;

    UPDATE public.property_photos
    SET sort_order = v_sort_order, updated_at = now()
    WHERE id = v_photo_id;

    v_kept_count := v_kept_count + 1;
    v_sort_order := v_sort_order + 1;
  END LOOP;

  FOR v_staging IN
    SELECT *
    FROM public.property_photo_staging
    WHERE operation_id = v_operation.id
    ORDER BY created_at ASC
  LOOP
    IF v_sort_order >= 10 THEN
      RETURN jsonb_build_object('status', 'photo_limit_exceeded');
    END IF;

    INSERT INTO public.property_photos (
      user_id,
      property_id,
      storage_path,
      original_name,
      mime_type,
      size_bytes,
      sort_order,
      checksum,
      updated_at
    )
    VALUES (
      v_user_id,
      v_property.id,
      replace(
        v_staging.storage_path,
        '/staging/',
        '/properties/' || v_property.id::TEXT || '/'
      ),
      v_staging.original_name,
      v_staging.mime_type,
      v_staging.size_bytes,
      v_sort_order,
      v_staging.checksum,
      now()
    );

    v_new_count := v_new_count + 1;
    v_sort_order := v_sort_order + 1;
  END LOOP;

  IF v_sort_order > 10 THEN
    RETURN jsonb_build_object('status', 'photo_limit_exceeded');
  END IF;

  UPDATE public.properties
  SET photo_collection_version = photo_collection_version + 1
  WHERE id = v_property.id;

  UPDATE public.property_photo_operations
  SET
    status = 'committed',
    committed_at = now(),
    updated_at = now()
  WHERE id = v_operation.id;

  DELETE FROM public.property_photo_staging
  WHERE operation_id = v_operation.id;

  RETURN jsonb_build_object(
    'status', 'committed',
    'property_id', v_property.id,
    'photo_collection_version', v_property.photo_collection_version + 1,
    'photo_count', v_sort_order
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.soft_delete_property_with_photos(
  p_property_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_property RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthorized');
  END IF;

  UPDATE public.properties
  SET
    deleted_at = now(),
    updated_at = now(),
    photo_collection_version = photo_collection_version + 1
  WHERE id = p_property_id
    AND user_id = v_user_id
    AND deleted_at IS NULL
  RETURNING id INTO v_property;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'property_not_found');
  END IF;

  DELETE FROM public.property_photos
  WHERE property_id = p_property_id
    AND user_id = v_user_id;

  RETURN jsonb_build_object('status', 'deleted', 'property_id', p_property_id);
END;
$$;

REVOKE ALL ON FUNCTION public.prepare_property_photo_operation(
  TEXT, TEXT, UUID, JSONB, JSONB, INTEGER
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_property_photo_staging(
  UUID, TEXT, TEXT, TEXT, INTEGER, TEXT
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.commit_property_create_with_photos(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.commit_property_update_with_photos(TEXT, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.soft_delete_property_with_photos(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.prepare_property_photo_operation(
  TEXT, TEXT, UUID, JSONB, JSONB, INTEGER
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_property_photo_staging(
  UUID, TEXT, TEXT, TEXT, INTEGER, TEXT
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.commit_property_create_with_photos(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.commit_property_update_with_photos(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.soft_delete_property_with_photos(UUID) TO authenticated;
