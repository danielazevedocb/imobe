"use server";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import {
  propertySchema,
  type PropertyFormInput,
} from "@/lib/validations/property-schema";

import {
  toPropertyPayload,
  type PropertyActionResult,
} from "../../_actions/property-utils";

export async function createPropertyAction(
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
  const payload = toPropertyPayload(validation.data, user.id);

  const { data, error } = await supabase
    .from("properties")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      message: "Não foi possível cadastrar o imóvel. Tente novamente.",
    };
  }

  return {
    success: true,
    propertyId: data.id,
  };
}
