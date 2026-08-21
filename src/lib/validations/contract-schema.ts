import { z } from "zod";

import {
  documentSchema,
  emailSchema,
  optionalLongText,
  phoneSchema,
  positiveMoney,
  shortText,
} from "@/lib/validations/common";

export const partySchema = z.object({
  person_type: z.enum(["individual", "company"], {
    message: "Selecione o tipo de pessoa",
  }),
  name: shortText("o nome"),
  document: documentSchema,
  registration: z.string().max(30, "Documento muito longo").optional(),
  address: shortText("o endereço", 200),
  phone: phoneSchema,
  email: emailSchema,
});

export const manualPropertySchema = z.object({
  type: z.enum(["apartment", "house", "commercial", "land", "other"]).optional(),
  address_street: shortText("a rua", 200),
  address_number: z.string().max(20).optional(),
  address_complement: z.string().max(80).optional(),
  neighborhood: shortText("o bairro"),
  city: shortText("a cidade"),
  location: shortText("a localização"),
});

export const rentDetailsSchema = z.object({
  start_date: z.string().min(1, "Informe a data de início"),
  end_date: z.string().min(1, "Informe a data de término"),
  rent_amount: positiveMoney,
  due_day: z.coerce
    .number()
    .int("Informe um dia válido")
    .min(1, "Informe um dia entre 1 e 28")
    .max(28, "Informe um dia entre 1 e 28"),
  payment_method: shortText("a forma de pagamento", 80),
  guarantee_type: shortText("o tipo de garantia", 80),
  guarantee_value: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((value) => {
      if (value === "" || value === null || value === undefined) return null;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    })
    .optional(),
  adjustment_index: shortText("o índice de reajuste", 80),
  charges_responsibility: shortText("as responsabilidades", 200),
  notes: optionalLongText,
});

export const saleDetailsSchema = z.object({
  sale_price: positiveMoney,
  payment_terms: shortText("as condições de pagamento", 300),
  possession_date: z.string().min(1, "Informe a data de posse/transferência"),
  deed_responsibility: shortText("a responsabilidade pela escritura", 200),
  tax_responsibility: shortText("a responsabilidade pelos tributos", 200),
  notes: optionalLongText,
});

const baseContractSchema = z.object({
  idempotency_key: z.string().uuid("Chave de idempotência inválida"),
  contract_type: z.enum(["rent", "sale"]),
  party_a: partySchema,
  party_b: partySchema,
});

export const linkedRentContractSchema = baseContractSchema.extend({
  contract_type: z.literal("rent"),
  property_id: z.string().uuid("Selecione um imóvel"),
  rent_details: rentDetailsSchema,
});

export const linkedSaleContractSchema = baseContractSchema.extend({
  contract_type: z.literal("sale"),
  property_id: z.string().uuid("Selecione um imóvel"),
  sale_details: saleDetailsSchema,
});

export const manualRentContractSchema = baseContractSchema.extend({
  contract_type: z.literal("rent"),
  property: manualPropertySchema,
  rent_details: rentDetailsSchema,
});

export const manualSaleContractSchema = baseContractSchema.extend({
  contract_type: z.literal("sale"),
  property: manualPropertySchema,
  sale_details: saleDetailsSchema,
});

export type LinkedRentContractInput = z.input<typeof linkedRentContractSchema>;
export type LinkedSaleContractInput = z.input<typeof linkedSaleContractSchema>;
export type ManualRentContractInput = z.input<typeof manualRentContractSchema>;
export type ManualSaleContractInput = z.input<typeof manualSaleContractSchema>;

export type ParsedGenerateContractInput =
  | z.infer<typeof linkedRentContractSchema>
  | z.infer<typeof linkedSaleContractSchema>
  | z.infer<typeof manualRentContractSchema>
  | z.infer<typeof manualSaleContractSchema>;

export type GenerateContractInput =
  | LinkedRentContractInput
  | LinkedSaleContractInput
  | ManualRentContractInput
  | ManualSaleContractInput;

export function parseGenerateContractInput(input: unknown) {
  const base = z
    .object({
      contract_type: z.enum(["rent", "sale"]),
      property_id: z.string().uuid().optional(),
      property: manualPropertySchema.optional(),
    })
    .safeParse(input);

  if (!base.success) {
    return { success: false as const, errors: base.error.flatten().fieldErrors };
  }

  const isLinked = Boolean(base.data.property_id);
  const isRent = base.data.contract_type === "rent";

  if (isLinked && isRent) {
    const parsed = linkedRentContractSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false as const, errors: parsed.error.flatten().fieldErrors };
    }
    return { success: true as const, data: parsed.data as ParsedGenerateContractInput, source: "linked" as const };
  }

  if (isLinked && !isRent) {
    const parsed = linkedSaleContractSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false as const, errors: parsed.error.flatten().fieldErrors };
    }
    return { success: true as const, data: parsed.data as ParsedGenerateContractInput, source: "linked" as const };
  }

  if (!isLinked && isRent) {
    const parsed = manualRentContractSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false as const, errors: parsed.error.flatten().fieldErrors };
    }
    return { success: true as const, data: parsed.data as ParsedGenerateContractInput, source: "manual" as const };
  }

  const parsed = manualSaleContractSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }
  return { success: true as const, data: parsed.data as ParsedGenerateContractInput, source: "manual" as const };
}
