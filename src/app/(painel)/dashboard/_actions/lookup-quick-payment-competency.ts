"use server";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";
import type { QuickPaymentCompetencyResult } from "@/lib/types/quick-payment";
import {
  quickPaymentLookupSchema,
  type QuickPaymentLookupInput,
} from "@/lib/validations/quick-payment-schema";

function mapCompetencyResult(data: Record<string, unknown>): QuickPaymentCompetencyResult {
  const status = String(data.status);

  if (status === "free") {
    return {
      status: "free",
      suggestedAmount:
        data.suggested_amount !== undefined && data.suggested_amount !== null
          ? Number(data.suggested_amount)
          : undefined,
    };
  }

  if (status === "pending" || status === "overdue" || status === "received") {
    return {
      status,
      incomeId: data.income_id ? String(data.income_id) : undefined,
      amount:
        data.amount !== undefined && data.amount !== null
          ? Number(data.amount)
          : undefined,
      suggestedAmount:
        data.suggested_amount !== undefined && data.suggested_amount !== null
          ? Number(data.suggested_amount)
          : undefined,
      updatedAt: data.updated_at ? String(data.updated_at) : undefined,
    };
  }

  if (status === "property_ineligible") {
    return { status: "property_ineligible" };
  }

  if (status === "invalid_month") {
    return { status: "invalid_month" };
  }

  return { status: "unauthorized" };
}

export async function lookupQuickPaymentCompetencyAction(
  input: QuickPaymentLookupInput,
): Promise<ActionResult<QuickPaymentCompetencyResult>> {
  const validation = quickPaymentLookupSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_rental_competency_status", {
    p_property_id: validation.data.property_id,
    p_reference_month: validation.data.reference_month,
  });

  if (error) {
    return {
      success: false,
      message: "Não foi possível consultar a competência. Tente novamente.",
    };
  }

  return {
    success: true,
    data: mapCompetencyResult((data ?? {}) as Record<string, unknown>),
  };
}
