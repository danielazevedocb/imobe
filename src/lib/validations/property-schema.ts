import { z } from "zod";

import type { Property } from "@/lib/types/property";

const optionalNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  });

export const propertySchema = z
  .object({
    type: z.enum(["apartment", "house", "commercial", "land", "other"], {
      message: "Selecione o tipo do imóvel",
    }),
    address_street: z.string().min(1, "Informe o endereço"),
    address_number: z.string().optional(),
    address_complement: z.string().optional(),
    neighborhood: z.string().min(1, "Informe o bairro"),
    city: z.string().min(1, "Informe a cidade"),
    location: z.string().min(1, "Informe a localização (estado/região)"),
    listing_url: z
      .string()
      .url("Informe uma URL válida")
      .optional()
      .or(z.literal("")),
    estimated_value: optionalNumber,
    iptu_value: optionalNumber,
    purpose: z.enum(["rent", "sale", "both"], {
      message: "Selecione a finalidade",
    }),
    rent_value: optionalNumber,
    sale_value: optionalNumber,
    rent_available: z.boolean().default(true),
    sale_available: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.purpose === "rent" || data.purpose === "both") {
      if (data.rent_value === null || data.rent_value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o valor mensal de aluguel",
          path: ["rent_value"],
        });
      }
    }

    if (data.purpose === "sale" || data.purpose === "both") {
      if (data.sale_value === null || data.sale_value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o valor de venda",
          path: ["sale_value"],
        });
      }
    }
  });

export type PropertyFormInput = z.input<typeof propertySchema>;
export type PropertyFormValues = z.output<typeof propertySchema>;

export function toPropertyFormDefaults(
  property?: Partial<Property> | Partial<PropertyFormValues>,
): PropertyFormInput {
  return {
    type: property?.type ?? "apartment",
    address_street: property?.address_street ?? "",
    address_number: property?.address_number ?? "",
    address_complement: property?.address_complement ?? "",
    neighborhood: property?.neighborhood ?? "",
    city: property?.city ?? "",
    location: property?.location ?? "",
    listing_url: property?.listing_url ?? "",
    estimated_value: property?.estimated_value ?? "",
    iptu_value: property?.iptu_value ?? "",
    purpose: property?.purpose ?? "rent",
    rent_value: property?.rent_value ?? "",
    sale_value: property?.sale_value ?? "",
    rent_available: property?.rent_available ?? true,
    sale_available: property?.sale_available ?? true,
  };
}
