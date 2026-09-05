import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { PropertyPhoto } from "@/lib/types/property-photo";

export async function getPropertyPhotoById(
  photoId: string,
): Promise<PropertyPhoto | null> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: photo, error } = await supabase
    .from("property_photos")
    .select("*")
    .eq("id", photoId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !photo) {
    return null;
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("deleted_at")
    .eq("id", photo.property_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (propertyError || !property || property.deleted_at) {
    return null;
  }

  return photo as PropertyPhoto;
}
