import type { PropertyFormValues } from "@/lib/validations/property-schema";

export function toPropertyPayload(
  values: PropertyFormValues,
  userId: string,
) {
  return {
    user_id: userId,
    type: values.type,
    address_street: values.address_street,
    address_number: values.address_number || null,
    address_complement: values.address_complement || null,
    neighborhood: values.neighborhood,
    city: values.city,
    location: values.location,
    listing_url: values.listing_url || null,
    estimated_value: values.estimated_value,
    iptu_value: values.iptu_value,
    purpose: values.purpose,
    rent_value:
      values.purpose === "rent" || values.purpose === "both"
        ? values.rent_value
        : null,
    sale_value:
      values.purpose === "sale" || values.purpose === "both"
        ? values.sale_value
        : null,
    rent_available:
      values.purpose === "rent" || values.purpose === "both"
        ? values.rent_available
        : false,
    sale_available:
      values.purpose === "sale" || values.purpose === "both"
        ? values.sale_available
        : false,
    updated_at: new Date().toISOString(),
  };
}

export type PropertyActionResult = {
  success: boolean;
  message?: string;
  propertyId?: string;
  errors?: Record<string, string[]>;
};
