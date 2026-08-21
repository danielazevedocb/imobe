"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";

const deleteRentalIncomeSchema = z.object({
  id: z.string().uuid("Rendimento inválido"),
  property_id: z.string().uuid("Imóvel inválido"),
});

export type DeleteRentalIncomeInput = z.infer<typeof deleteRentalIncomeSchema>;

export async function deleteRentalIncomeAction(
  input: DeleteRentalIncomeInput,
): Promise<ActionResult> {
  const validation = deleteRentalIncomeSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const user = await requireAuth();
  const supabase = await createClient();
  const { id, property_id } = validation.data;

  const { data: income, error: fetchError } = await supabase
    .from("rental_incomes")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("property_id", property_id)
    .maybeSingle();

  if (fetchError || !income) {
    return {
      success: false,
      message: "Rendimento não encontrado.",
    };
  }

  const { error } = await supabase
    .from("rental_incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("property_id", property_id);

  if (error) {
    return {
      success: false,
      message: "Não foi possível excluir o rendimento. Tente novamente.",
    };
  }

  revalidatePath(`/imoveis/${property_id}`);
  revalidatePath("/dashboard");
  return { success: true };
}
