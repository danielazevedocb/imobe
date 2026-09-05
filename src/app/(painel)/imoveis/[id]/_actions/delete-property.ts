"use server";

import { deletePropertyWithPhotosAction } from "@/app/(painel)/imoveis/_actions/property-photo-actions";

import type { PropertyActionResult } from "../../_actions/property-utils";

export async function deletePropertyAction(
  propertyId: string,
): Promise<PropertyActionResult> {
  return deletePropertyWithPhotosAction(propertyId);
}
