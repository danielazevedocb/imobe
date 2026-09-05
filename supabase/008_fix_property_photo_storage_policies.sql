-- 008_fix_property_photo_storage_policies.sql
-- Execute no Supabase Dashboard → SQL Editor (após 007_property_photos.sql)
-- Corrige leitura/escrita necessárias para mover staging → properties após o commit.

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

-- Permite servir a foto se o metadado apontar para o caminho (staging ou properties).
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
