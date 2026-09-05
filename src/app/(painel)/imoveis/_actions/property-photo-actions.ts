"use server";

import { revalidatePath } from "next/cache";

import { toPropertyPayload } from "@/app/(painel)/imoveis/_actions/property-utils";
import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { PropertyPhotoManifest } from "@/lib/validations/property-photo-schema";
import {
  propertySchema,
  type PropertyFormInput,
} from "@/lib/validations/property-schema";
import {
  commitPropertyCreateOperation,
  commitPropertyUpdateOperation,
  preparePropertyPhotoOperation,
} from "@/services/property-photos/operations";

import type { PropertyActionResult } from "../_actions/property-utils";

type PrepareResult =
  | {
      success: true;
      operationId: string;
      operationKey: string;
    }
  | {
      success: false;
      message: string;
      status?: string;
    };

export async function preparePropertyCreateAction(
  operationKey: string,
  input: PropertyFormInput,
): Promise<PrepareResult> {
  const validation = propertySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: "Verifique os dados do imóvel antes de enviar as fotos.",
    };
  }

  try {
    const user = await requireAuth();
    const payload = toPropertyPayload(validation.data, user.id);
    const result = await preparePropertyPhotoOperation({
      operationKey,
      operationType: "create",
      propertyPayload: payload,
      photoManifest: [],
    });

    if (result.status === "unauthorized") {
      return { success: false, message: "Sessão expirada. Faça login novamente." };
    }

    if (result.status !== "prepared" || !result.operation_id) {
      return {
        success: false,
        message: "Não foi possível preparar o cadastro do imóvel.",
        status: String(result.status),
      };
    }

    return {
      success: true,
      operationId: String(result.operation_id),
      operationKey,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível preparar o cadastro do imóvel.",
    };
  }
}

export async function commitPropertyCreateAction(
  operationKey: string,
): Promise<PropertyActionResult> {
  try {
    const result = await commitPropertyCreateOperation(operationKey);

    if (result.status === "committed" && result.property_id) {
      const propertyId = String(result.property_id);
      revalidatePath("/dashboard");
      revalidatePath("/imoveis");
      revalidatePath(`/imoveis/${propertyId}`);

      return {
        success: true,
        propertyId,
      };
    }

    return {
      success: false,
      message: mapCommitError(String(result.status)),
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível concluir o cadastro do imóvel.",
    };
  }
}

export async function preparePropertyUpdateAction(input: {
  operationKey: string;
  propertyId: string;
  values: PropertyFormInput;
  photoManifest: PropertyPhotoManifest;
  expectedPhotoVersion: number;
}): Promise<PrepareResult> {
  const validation = propertySchema.safeParse(input.values);

  if (!validation.success) {
    return {
      success: false,
      message: "Verifique os dados do imóvel antes de enviar as fotos.",
    };
  }

  try {
    const user = await requireAuth();
    const payload = toPropertyPayload(validation.data, user.id);
    const result = await preparePropertyPhotoOperation({
      operationKey: input.operationKey,
      operationType: "update",
      propertyId: input.propertyId,
      propertyPayload: payload,
      photoManifest: input.photoManifest,
      expectedPhotoVersion: input.expectedPhotoVersion,
    });

    if (result.status === "conflict_version") {
      return {
        success: false,
        message:
          "As fotos deste imóvel foram alteradas em outra sessão. Recarregue a página e tente novamente.",
        status: "conflict_version",
      };
    }

    if (result.status === "property_not_found") {
      return {
        success: false,
        message: "Imóvel não encontrado.",
      };
    }

    if (result.status !== "prepared" || !result.operation_id) {
      return {
        success: false,
        message: "Não foi possível preparar a edição do imóvel.",
        status: String(result.status),
      };
    }

    return {
      success: true,
      operationId: String(result.operation_id),
      operationKey: input.operationKey,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível preparar a edição do imóvel.",
    };
  }
}

export async function commitPropertyUpdateAction(input: {
  operationKey: string;
  expectedPhotoVersion: number;
  propertyId: string;
}): Promise<PropertyActionResult> {
  try {
    const result = await commitPropertyUpdateOperation(
      input.operationKey,
      input.expectedPhotoVersion,
    );

    if (result.status === "committed" && result.property_id) {
      const propertyId = String(result.property_id);
      revalidatePath("/dashboard");
      revalidatePath("/imoveis");
      revalidatePath(`/imoveis/${propertyId}`);
      revalidatePath(`/imoveis/${propertyId}/editar`);

      return {
        success: true,
        propertyId,
      };
    }

    if (result.status === "conflict_version") {
      return {
        success: false,
        message:
          "As fotos deste imóvel foram alteradas em outra sessão. Recarregue a página e tente novamente.",
      };
    }

    if (result.status === "conflict_photos") {
      return {
        success: false,
        message:
          "A coleção de fotos mudou enquanto você editava. Recarregue a página e tente novamente.",
      };
    }

    return {
      success: false,
      message: mapCommitError(String(result.status)),
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível salvar as alterações do imóvel.",
    };
  }
}

export async function deletePropertyWithPhotosAction(
  propertyId: string,
): Promise<PropertyActionResult> {
  try {
    await requireAuth();
    const supabase = await createClient();

    const { data: photos } = await supabase
      .from("property_photos")
      .select("storage_path")
      .eq("property_id", propertyId);

    const { data, error } = await supabase.rpc("soft_delete_property_with_photos", {
      p_property_id: propertyId,
    });

    if (error || data?.status !== "deleted") {
      return {
        success: false,
        message: "Não foi possível excluir o imóvel.",
      };
    }

    if (photos?.length) {
      await supabase.storage
        .from("property-photos")
        .remove(photos.map((photo) => photo.storage_path));
    }

    revalidatePath("/dashboard");
    revalidatePath("/imoveis");

    return {
      success: true,
      propertyId,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível excluir o imóvel.",
    };
  }
}

function mapCommitError(status: string): string {
  switch (status) {
    case "photo_limit_exceeded":
      return "O imóvel pode ter no máximo 10 fotos.";
    case "operation_not_found":
      return "Operação expirada. Tente salvar novamente.";
    case "invalid_operation":
      return "Operação inválida. Recarregue a página e tente novamente.";
    case "property_not_found":
      return "Imóvel não encontrado.";
    default:
      return "Não foi possível concluir a operação.";
  }
}
