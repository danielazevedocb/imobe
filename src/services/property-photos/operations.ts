import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { PropertyPhotoManifest } from "@/lib/validations/property-photo-schema";
import { getFileExtension } from "@/lib/validations/property-photo-schema";
import {
  buildPropertyPhotoStagingPath,
  PROPERTY_PHOTOS_BUCKET,
  toConfirmedStoragePath,
} from "@/services/property-photos/storage-paths";
import { validateImageBuffer } from "@/services/property-photos/validate-image";
import { randomUUID } from "node:crypto";

type StagingRow = {
  id: string;
  storage_path: string;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function serializePropertyPayload(
  payload: Record<string, unknown>,
): Record<string, string | null> {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      value === null || value === undefined ? null : String(value),
    ]),
  );
}

async function getStagingRowsForOperationKey(
  operationKey: string,
): Promise<StagingRow[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: operation } = await supabase
    .from("property_photo_operations")
    .select("id")
    .eq("user_id", user.id)
    .eq("operation_key", operationKey)
    .maybeSingle();

  if (!operation) {
    return [];
  }

  const { data: stagingRows } = await supabase
    .from("property_photo_staging")
    .select("id, storage_path")
    .eq("operation_id", operation.id);

  return stagingRows ?? [];
}

async function findStagingObjectByFileName(
  supabase: SupabaseServerClient,
  userId: string,
  fileName: string,
): Promise<string | null> {
  const { data: operationFolders, error } = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .list(`${userId}/staging`, { limit: 100 });

  if (error || !operationFolders) {
    return null;
  }

  for (const folder of operationFolders) {
    if (!folder.name) continue;

    const { data: files } = await supabase.storage
      .from(PROPERTY_PHOTOS_BUCKET)
      .list(`${userId}/staging/${folder.name}`, { limit: 100 });

    const match = files?.find((file) => file.name === fileName);
    if (match) {
      return `${userId}/staging/${folder.name}/${fileName}`;
    }
  }

  return null;
}

export async function ensureConfirmedPhotoObject(input: {
  supabase: SupabaseServerClient;
  userId: string;
  storagePath: string;
  propertyId: string;
}): Promise<boolean> {
  const { supabase, userId, storagePath, propertyId } = input;

  const primary = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .download(storagePath);

  if (primary.data) {
    return true;
  }

  const fileName = storagePath.split("/").pop();
  if (!fileName) {
    return false;
  }

  const stagingPath = await findStagingObjectByFileName(supabase, userId, fileName);
  if (!stagingPath) {
    return false;
  }

  const confirmedPath = storagePath.includes("/properties/")
    ? storagePath
    : toConfirmedStoragePath(stagingPath, propertyId);

  const moved = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .move(stagingPath, confirmedPath);

  if (!moved.error) {
    if (confirmedPath !== storagePath) {
      await supabase
        .from("property_photos")
        .update({ storage_path: confirmedPath, updated_at: new Date().toISOString() })
        .eq("storage_path", storagePath)
        .eq("user_id", userId);
    }
    return true;
  }

  const download = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .download(stagingPath);

  if (!download.data) {
    return false;
  }

  const buffer = Buffer.from(await download.data.arrayBuffer());
  const upload = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .upload(confirmedPath, buffer, { upsert: true });

  if (upload.error) {
    return false;
  }

  await supabase.storage.from(PROPERTY_PHOTOS_BUCKET).remove([stagingPath]);

  if (confirmedPath !== storagePath) {
    await supabase
      .from("property_photos")
      .update({ storage_path: confirmedPath, updated_at: new Date().toISOString() })
      .eq("storage_path", storagePath)
      .eq("user_id", userId);
  }

  return true;
}

async function moveStagingFilesToConfirmed(
  stagingRows: StagingRow[],
  propertyId: string,
) {
  if (stagingRows.length === 0) {
    return;
  }

  const user = await requireAuth();
  const supabase = await createClient();

  for (const row of stagingRows) {
    const confirmedPath = toConfirmedStoragePath(row.storage_path, propertyId);

    const moved = await supabase.storage
      .from(PROPERTY_PHOTOS_BUCKET)
      .move(row.storage_path, confirmedPath);

    if (!moved.error) {
      continue;
    }

    const recovered = await ensureConfirmedPhotoObject({
      supabase,
      userId: user.id,
      storagePath: confirmedPath,
      propertyId,
    });

    if (!recovered) {
      // Mantém a foto servível pelo caminho de staging se o move falhar.
      await supabase
        .from("property_photos")
        .update({
          storage_path: row.storage_path,
          updated_at: new Date().toISOString(),
        })
        .eq("storage_path", confirmedPath)
        .eq("user_id", user.id);
    }
  }
}

export async function preparePropertyPhotoOperation(input: {
  operationKey: string;
  operationType: "create" | "update";
  propertyId?: string;
  propertyPayload?: Record<string, unknown>;
  photoManifest?: PropertyPhotoManifest;
  expectedPhotoVersion?: number;
}) {
  await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("prepare_property_photo_operation", {
    p_operation_key: input.operationKey,
    p_operation_type: input.operationType,
    p_property_id: input.propertyId ?? null,
    p_property_payload: input.propertyPayload
      ? serializePropertyPayload(input.propertyPayload)
      : null,
    p_photo_manifest: input.photoManifest ?? [],
    p_expected_photo_version: input.expectedPhotoVersion ?? null,
  });

  if (error) {
    throw new Error("Não foi possível preparar a operação de fotos.");
  }

  return data as Record<string, unknown>;
}

export async function uploadPropertyPhotoStaging(input: {
  operationId: string;
  fileName: string;
  buffer: Buffer;
}) {
  const user = await requireAuth();
  const supabase = await createClient();
  const validation = await validateImageBuffer(input.buffer, input.fileName);

  if (!validation.valid) {
    return {
      success: false as const,
      message: validation.reason,
    };
  }

  const photoId = randomUUID();
  const storagePath = buildPropertyPhotoStagingPath(
    user.id,
    input.operationId,
    photoId,
    getFileExtension(input.fileName),
  );

  const uploadResult = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .upload(storagePath, input.buffer, {
      contentType: validation.mimeType,
      upsert: false,
    });

  if (uploadResult.error) {
    return {
      success: false as const,
      message: "Não foi possível enviar a foto. Tente novamente.",
    };
  }

  const { data, error } = await supabase.rpc("register_property_photo_staging", {
    p_operation_id: input.operationId,
    p_storage_path: storagePath,
    p_original_name: input.fileName,
    p_mime_type: validation.mimeType,
    p_size_bytes: validation.sizeBytes,
    p_checksum: validation.checksum,
  });

  if (error || data?.status !== "registered") {
    await supabase.storage.from(PROPERTY_PHOTOS_BUCKET).remove([storagePath]);

    return {
      success: false as const,
      message: "Não foi possível registrar a foto enviada.",
    };
  }

  const { data: stagingRow } = await supabase
    .from("property_photo_staging")
    .select("id")
    .eq("storage_path", storagePath)
    .maybeSingle();

  return {
    success: true as const,
    stagingId: stagingRow?.id ?? photoId,
    storagePath,
    originalName: input.fileName,
    mimeType: validation.mimeType,
    sizeBytes: validation.sizeBytes,
  };
}

export async function commitPropertyCreateOperation(operationKey: string) {
  await requireAuth();
  const supabase = await createClient();
  const stagingRows = await getStagingRowsForOperationKey(operationKey);

  const { data, error } = await supabase.rpc("commit_property_create_with_photos", {
    p_operation_key: operationKey,
  });

  if (error) {
    throw new Error("Não foi possível concluir o cadastro do imóvel.");
  }

  const result = data as Record<string, unknown>;

  if (result.status === "committed" && result.property_id) {
    await moveStagingFilesToConfirmed(stagingRows, String(result.property_id));
  }

  return result;
}

export async function commitPropertyUpdateOperation(
  operationKey: string,
  expectedPhotoVersion: number,
) {
  await requireAuth();
  const supabase = await createClient();
  const stagingRows = await getStagingRowsForOperationKey(operationKey);

  const { data, error } = await supabase.rpc("commit_property_update_with_photos", {
    p_operation_key: operationKey,
    p_expected_photo_version: expectedPhotoVersion,
  });

  if (error) {
    throw new Error("Não foi possível salvar as alterações do imóvel.");
  }

  const result = data as Record<string, unknown>;

  if (result.status === "committed" && result.property_id) {
    await moveStagingFilesToConfirmed(stagingRows, String(result.property_id));
  }

  return result;
}
