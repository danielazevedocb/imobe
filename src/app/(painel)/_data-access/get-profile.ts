import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
};

export async function getProfile(): Promise<Profile | null> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("id", user.id)
    .single();

  return data;
}
