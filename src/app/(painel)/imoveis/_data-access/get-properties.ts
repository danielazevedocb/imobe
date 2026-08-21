import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types/property";

export async function getProperties(): Promise<Property[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar imóveis");
  }

  return (data ?? []) as Property[];
}
