"use server";

import {
  commitPropertyUpdateAction,
  preparePropertyUpdateAction,
} from "@/app/(painel)/imoveis/_actions/property-photo-actions";
import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import {
  propertySchema,
  type PropertyFormInput,
} from "@/lib/validations/property-schema";

import {
  type PropertyActionResult,
} from "../../../_actions/property-utils";

export async function updatePropertyAction(
  propertyId: string,
  input: PropertyFormInput,
): Promise<PropertyActionResult> {
  const validation = propertySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const user = await requireAuth();
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select("photo_collection_version")
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !property) {
    return {
      success: false,
      message: "Imóvel não encontrado.",
    };
  }

  const operationKey = crypto.randomUUID();

  const prepareResult = await preparePropertyUpdateAction({
    operationKey,
    propertyId,
    values: validation.data,
    photoManifest: [],
    expectedPhotoVersion: property.photo_collection_version,
  });

  if (!prepareResult.success) {
    return {
      success: false,
      message: prepareResult.message,
    };
  }

  return commitPropertyUpdateAction({
    operationKey,
    expectedPhotoVersion: property.photo_collection_version,
    propertyId,
  });
}
