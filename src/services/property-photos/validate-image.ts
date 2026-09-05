import { createHash } from "node:crypto";

import sharp from "sharp";

import {
  getFileExtension,
  isAllowedPhotoExtension,
  MAX_PROPERTY_PHOTO_BYTES,
} from "@/lib/validations/property-photo-schema";

export type ValidatedImageResult =
  | {
      valid: true;
      mimeType: "image/png" | "image/jpeg";
      sizeBytes: number;
      checksum: string;
      width: number;
      height: number;
    }
  | {
      valid: false;
      reason: string;
    };

function normalizeMimeType(format: string | undefined): "image/png" | "image/jpeg" | null {
  if (format === "png") return "image/png";
  if (format === "jpeg" || format === "jpg") return "image/jpeg";
  return null;
}

export async function validateImageBuffer(
  buffer: Buffer,
  originalName: string,
): Promise<ValidatedImageResult> {
  if (buffer.byteLength < 1) {
    return { valid: false, reason: "Arquivo vazio" };
  }

  if (buffer.byteLength > MAX_PROPERTY_PHOTO_BYTES) {
    return { valid: false, reason: "Arquivo acima de 3 MB" };
  }

  if (!isAllowedPhotoExtension(originalName)) {
    return { valid: false, reason: "Formato não permitido. Use PNG ou JPEG" };
  }

  const extension = getFileExtension(originalName);

  try {
    const image = sharp(buffer, { failOn: "error" });
    const metadata = await image.metadata();
    const detectedMime = normalizeMimeType(metadata.format);

    if (!detectedMime) {
      return {
        valid: false,
        reason: "Conteúdo incompatível. Use uma imagem PNG ou JPEG válida",
      };
    }

    if (
      (extension === "png" && detectedMime !== "image/png") ||
      ((extension === "jpg" || extension === "jpeg") && detectedMime !== "image/jpeg")
    ) {
      return {
        valid: false,
        reason: "Extensão incompatível com o conteúdo do arquivo",
      };
    }

    await image.clone().rotate().toBuffer();

    const checksum = createHash("sha256").update(buffer).digest("hex");

    return {
      valid: true,
      mimeType: detectedMime,
      sizeBytes: buffer.byteLength,
      checksum,
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
    };
  } catch {
    return {
      valid: false,
      reason: "Arquivo corrompido ou inválido",
    };
  }
}

export async function validateImageFile(file: File): Promise<ValidatedImageResult> {
  const arrayBuffer = await file.arrayBuffer();
  return validateImageBuffer(Buffer.from(arrayBuffer), file.name);
}
