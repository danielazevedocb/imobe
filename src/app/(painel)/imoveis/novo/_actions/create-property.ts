"use server";

import {
  commitPropertyCreateAction,
  preparePropertyCreateAction,
} from "@/app/(painel)/imoveis/_actions/property-photo-actions";
import {
  propertySchema,
  type PropertyFormInput,
} from "@/lib/validations/property-schema";

import type { PropertyActionResult } from "../../_actions/property-utils";

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

  const operationKey = crypto.randomUUID();
  const prepareResult = await preparePropertyCreateAction(operationKey, validation.data);

  if (!prepareResult.success) {
    return {
      success: false,
      message: prepareResult.message,
    };
  }

  return commitPropertyCreateAction(operationKey);
}
