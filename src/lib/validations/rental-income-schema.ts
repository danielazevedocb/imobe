import { z } from "zod";

import { monthKeySchema, positiveMoney } from "@/lib/validations/common";

export const rentalIncomeSchema = z.object({
  property_id: z.string().uuid("Imóvel inválido"),
  reference_month: monthKeySchema,
  amount: positiveMoney,
  status: z.enum(["received", "pending", "overdue"], {
    message: "Selecione o status",
  }),
});

export type RentalIncomeFormInput = z.input<typeof rentalIncomeSchema>;
export type RentalIncomeFormValues = z.infer<typeof rentalIncomeSchema>;
