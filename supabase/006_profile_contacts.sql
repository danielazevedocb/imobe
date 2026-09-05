-- 006_profile_contacts.sql
-- Execute no Supabase Dashboard → SQL Editor (após 005_quick_payments.sql)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS instagram_username TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_username TEXT;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_instagram_username_format;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_instagram_username_format
  CHECK (
    instagram_username IS NULL
    OR (
      length(instagram_username) BETWEEN 1 AND 100
      AND instagram_username ~ '^[A-Za-z0-9._]+$'
    )
  );

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_tiktok_username_format;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_tiktok_username_format
  CHECK (
    tiktok_username IS NULL
    OR (
      length(tiktok_username) BETWEEN 1 AND 100
      AND tiktok_username ~ '^[A-Za-z0-9._]+$'
    )
  );

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_full_name_length;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_full_name_length
  CHECK (
    length(trim(full_name)) BETWEEN 2 AND 120
  );
