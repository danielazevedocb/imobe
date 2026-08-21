"use server";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import type { PropertyActionResult } from "../../_actions/property-utils";

export async function deletePropertyAction(
  propertyId: string,
): Promise<PropertyActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      message: "Não foi possível excluir o imóvel.",
    };
  }

  return { success: true, propertyId: data.id };
}
