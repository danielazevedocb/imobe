"use server";

import { revalidatePath } from "next/cache";

import { normalizeReferenceMonth } from "@/lib/format/date";
import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";
import {
  rentalIncomeSchema,
  type RentalIncomeFormInput,
} from "@/lib/validations/rental-income-schema";

export async function createRentalIncomeAction(
  input: RentalIncomeFormInput,
): Promise<ActionResult> {
  const validation = rentalIncomeSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const user = await requireAuth();
  const supabase = await createClient();
  const { property_id, reference_month, amount, status } = validation.data;

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, purpose, deleted_at")
    .eq("id", property_id)
    .eq("user_id", user.id)
    .single();

  if (propertyError || !property || property.deleted_at) {
    return {
      success: false,
      message: "Imóvel não encontrado.",
    };
  }

  if (property.purpose === "sale") {
    return {
      success: false,
      message: "Este imóvel não permite registro de rendimento de aluguel.",
    };
  }

  const { error } = await supabase.from("rental_incomes").insert({
    user_id: user.id,
    property_id,
    reference_month: normalizeReferenceMonth(reference_month),
    amount,
    status,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "Já existe um rendimento registrado para este mês.",
      };
    }
    return {
      success: false,
      message: "Não foi possível registrar o rendimento. Tente novamente.",
    };
  }

  revalidatePath(`/imoveis/${property_id}`);
  revalidatePath("/dashboard");
  return { success: true };
}
