import { notFound } from "next/navigation";

import { getPropertyPhotoById } from "@/app/(painel)/imoveis/_data-access/get-property-photo-by-id";
import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { ensureConfirmedPhotoObject } from "@/services/property-photos/operations";
import { PROPERTY_PHOTOS_BUCKET } from "@/services/property-photos/storage-paths";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await requireAuth();
  const { id } = await context.params;
  const photo = await getPropertyPhotoById(id);

  if (!photo) {
    notFound();
  }

  const supabase = await createClient();

  await ensureConfirmedPhotoObject({
    supabase,
    userId: user.id,
    storagePath: photo.storage_path,
    propertyId: photo.property_id,
  });

  // Recarrega o caminho caso a recuperação tenha atualizado o metadado.
  const refreshed = await getPropertyPhotoById(id);
  const storagePath = refreshed?.storage_path ?? photo.storage_path;

  const { data, error } = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .download(storagePath);

  if (error || !data) {
    notFound();
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": photo.mime_type,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
