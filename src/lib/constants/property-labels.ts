import type { PropertyPurpose, PropertyType } from "@/lib/types/property";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Apartamento",
  house: "Casa",
  commercial: "Comercial",
  land: "Terreno",
  other: "Outro",
};

export const PROPERTY_PURPOSE_LABELS: Record<PropertyPurpose, string> = {
  rent: "Aluguel",
  sale: "Venda",
  both: "Aluguel e venda",
};

export const PROPERTY_TYPE_OPTIONS = Object.entries(PROPERTY_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as PropertyType, label }),
);

export const PROPERTY_PURPOSE_OPTIONS = Object.entries(
  PROPERTY_PURPOSE_LABELS,
).map(([value, label]) => ({ value: value as PropertyPurpose, label }));
