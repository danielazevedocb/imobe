import { z } from "zod";

export const MAX_PROPERTY_PHOTOS = 10;
export const MAX_PROPERTY_PHOTO_BYTES = 3_000_000;

const allowedExtensions = new Set(["png", "jpg", "jpeg"]);

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.at(-1)!.toLowerCase() : "";
}

export function isAllowedPhotoExtension(fileName: string): boolean {
  return allowedExtensions.has(getFileExtension(fileName));
}

export function validateSelectedPhotoFile(file: File): string | null {
  if (file.size < 1) {
    return "Arquivo vazio";
  }

  if (file.size > MAX_PROPERTY_PHOTO_BYTES) {
    return "Arquivo acima de 3 MB";
  }

  if (!isAllowedPhotoExtension(file.name)) {
    return "Formato não permitido. Use PNG ou JPEG";
  }

  const mime = file.type.toLowerCase();
  if (mime !== "image/png" && mime !== "image/jpeg") {
    return "Formato não permitido. Use PNG ou JPEG";
  }

  return null;
}

export const propertyPhotoManifestSchema = z.array(
  z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("keep"),
      photo_id: z.string().uuid(),
      sort_order: z.number().int().min(0),
    }),
    z.object({
      kind: z.literal("new"),
      staging_id: z.string().uuid(),
    }),
  ]),
);

export type PropertyPhotoManifest = z.infer<typeof propertyPhotoManifestSchema>;
