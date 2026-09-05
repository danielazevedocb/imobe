"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";
import type { QuickPaymentCommitResult } from "@/lib/types/quick-payment";
import {
  quickPaymentCommitSchema,
  type QuickPaymentCommitInput,
} from "@/lib/validations/quick-payment-schema";

function mapCommitResult(data: Record<string, unknown>): QuickPaymentCommitResult {
  const status = String(data.status) as QuickPaymentCommitResult["status"];

  return {
    status,
    incomeId: data.income_id ? String(data.income_id) : undefined,
    amount:
      data.amount !== undefined && data.amount !== null
        ? Number(data.amount)
        : undefined,
    incomeStatus: data.income_status
      ? (String(data.income_status) as QuickPaymentCommitResult["incomeStatus"])
      : undefined,
    propertyId: data.property_id ? String(data.property_id) : undefined,
    referenceMonth: data.reference_month
      ? String(data.reference_month)
      : undefined,
    updatedAt: data.updated_at ? String(data.updated_at) : undefined,
  };
}

function getCommitMessage(result: QuickPaymentCommitResult): string | undefined {
  switch (result.status) {
    case "already_received":
      return "Este mês já possui um recebimento registrado.";
    case "needs_confirmation":
      return "Confirme a atualização do lançamento pendente.";
    case "conflict_changed":
      return "O lançamento foi alterado em outro acesso. Revise os dados atuais.";
    case "conflict_removed":
      return "O lançamento não está mais disponível. Revise a competência.";
    case "property_ineligible":
      return "Este imóvel não pode receber pagamento pelo atalho.";
    case "invalid_amount":
      return "Informe um valor válido.";
    case "invalid_month":
      return "Informe um mês válido.";
    case "unauthorized":
      return "Sessão expirada. Entre novamente para continuar.";
    default:
      return undefined;
  }
}

export async function commitQuickPaymentAction(
  input: QuickPaymentCommitInput,
): Promise<ActionResult<QuickPaymentCommitResult>> {
  const validation = quickPaymentCommitSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  await requireAuth();
  const supabase = await createClient();
  const payload = validation.data;

  const { data, error } = await supabase.rpc("commit_quick_rental_payment", {
    p_operation_key: payload.operation_key,
    p_property_id: payload.property_id,
    p_reference_month: payload.reference_month,
    p_amount: payload.amount,
    p_confirm_update: payload.confirm_update,
    p_expected_income_id: payload.expected_income_id ?? null,
    p_expected_status: payload.expected_status ?? null,
    p_expected_amount: payload.expected_amount ?? null,
    p_expected_updated_at: payload.expected_updated_at ?? null,
  });

  if (error) {
    return {
      success: false,
      message: "Não foi possível registrar o pagamento. Tente novamente.",
    };
  }

  const result = mapCommitResult((data ?? {}) as Record<string, unknown>);
  const message = getCommitMessage(result);

  if (result.status === "committed") {
    revalidatePath("/dashboard");
    if (result.propertyId) {
      revalidatePath(`/imoveis/${result.propertyId}`);
    }

    return {
      success: true,
      data: result,
      message: "Pagamento registrado com sucesso.",
    };
  }

  return {
    success: false,
    data: result,
    message,
  };
}
