import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { PropertyPhoto } from "@/lib/types/property-photo";

export async function getPropertyPhotos(propertyId: string): Promise<PropertyPhoto[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("property_photos")
    .select("*")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error("Erro ao buscar fotos do imóvel");
  }

  return (data ?? []) as PropertyPhoto[];
}
