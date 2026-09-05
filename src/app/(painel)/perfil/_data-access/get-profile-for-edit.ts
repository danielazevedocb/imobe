import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { ProfileForEdit } from "@/lib/types/profile";

export async function getProfileForEdit(): Promise<ProfileForEdit> {
  const user = await requireAuth();
  const supabase = await createClient();

  const [{ data: profile, error }, { data: authData, error: authError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, phone, instagram_username, tiktok_username")
        .eq("id", user.id)
        .single(),
      supabase.auth.getUser(),
    ]);

  if (error || !profile || authError || !authData.user?.email) {
    throw new Error("Perfil indisponível");
  }

  return {
    id: profile.id,
    full_name: profile.full_name,
    email: authData.user.email,
    phone: profile.phone,
    instagram_username: profile.instagram_username,
    tiktok_username: profile.tiktok_username,
  };
}
