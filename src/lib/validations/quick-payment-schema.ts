import { z } from "zod";

import { monthKeySchema } from "@/lib/validations/common";

const MAX_QUICK_PAYMENT_AMOUNT = 999_999_999_999.99;

function parseQuickPaymentAmount(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export const quickPaymentAmountSchema = z
  .union([z.string(), z.number()])
  .transform((value) => parseQuickPaymentAmount(value))
  .pipe(
    z
      .number({
        invalid_type_error: "Informe um valor válido",
      })
      .min(0.01, "Informe um valor de pelo menos R$ 0,01")
      .max(
        MAX_QUICK_PAYMENT_AMOUNT,
        "Informe um valor dentro do limite permitido",
      ),
  );

export const quickPaymentLookupSchema = z.object({
  property_id: z.string().uuid("Selecione um imóvel válido"),
  reference_month: monthKeySchema,
});

export const quickPaymentCommitSchema = z.object({
  operation_key: z.string().uuid("Operação inválida"),
  property_id: z.string().uuid("Selecione um imóvel válido"),
  reference_month: monthKeySchema,
  amount: quickPaymentAmountSchema,
  confirm_update: z.boolean().default(false),
  expected_income_id: z.string().uuid().optional(),
  expected_status: z.enum(["pending", "overdue"]).optional(),
  expected_amount: quickPaymentAmountSchema.optional(),
  expected_updated_at: z.string().datetime().optional(),
});

export type QuickPaymentLookupInput = z.infer<typeof quickPaymentLookupSchema>;
export type QuickPaymentCommitInput = z.infer<typeof quickPaymentCommitSchema>;
