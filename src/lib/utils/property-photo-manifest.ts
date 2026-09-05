import type { ExistingPropertyPhotoState } from "@/lib/types/property-photo";

export function buildKeptPhotoManifest(
  keptExisting: ExistingPropertyPhotoState[],
) {
  return keptExisting.map((photo, index) => ({
    kind: "keep" as const,
    photo_id: photo.id,
    sort_order: index,
  }));
}
