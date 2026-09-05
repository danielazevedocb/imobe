import type { QuickPaymentPropertyOption } from "@/lib/types/quick-payment";

export function formatQuickPaymentPropertyLabel(
  property: QuickPaymentPropertyOption,
): string {
  const address = property.address_number
    ? `${property.address_street}, ${property.address_number}`
    : property.address_street;

  return `${address} — ${property.neighborhood}, ${property.city}/${property.location}`;
}
