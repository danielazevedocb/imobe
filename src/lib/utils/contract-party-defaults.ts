import type { Property } from "@/lib/types/property";

export type PartyDefaults = {
  person_type: "individual";
  name: string;
  document: string;
  registration: string;
  address: string;
  phone: string;
  email: string;
};

export const EMPTY_PARTY_DEFAULTS: PartyDefaults = {
  person_type: "individual",
  name: "",
  document: "",
  registration: "",
  address: "",
  phone: "",
  email: "",
};

export function buildEmptyPartyDefaults(): PartyDefaults {
  return { ...EMPTY_PARTY_DEFAULTS };
}

export function formatPropertyAddress(property: Property): string {
  const streetLine = [
    property.address_street,
    property.address_number,
    property.address_complement,
  ]
    .filter(Boolean)
    .join(", ");

  return [streetLine, property.neighborhood, `${property.city}/${property.location}`]
    .filter(Boolean)
    .join(" — ");
}

export function buildTenantAddressDefaults(
  property?: Property | null,
): PartyDefaults {
  return {
    ...EMPTY_PARTY_DEFAULTS,
    address: property ? formatPropertyAddress(property) : "",
  };
}

export function getPropertyFinancialDefault(
  property: Property | undefined,
  contractType: "rent" | "sale",
): number | "" {
  if (!property) return "";

  if (contractType === "rent" && property.rent_value) {
    return property.rent_value;
  }

  if (contractType === "sale" && property.sale_value) {
    return property.sale_value;
  }

  return "";
}
