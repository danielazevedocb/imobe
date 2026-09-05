import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { QuickPaymentPropertyOption } from "@/lib/types/quick-payment";

export async function getQuickPaymentProperties(): Promise<
  QuickPaymentPropertyOption[]
> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, address_street, address_number, neighborhood, city, location, rent_value, purpose",
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .in("purpose", ["rent", "both"])
    .order("address_street", { ascending: true });

  if (error) {
    throw new Error("Erro ao buscar imóveis elegíveis para pagamento");
  }

  return (data ?? []).map((property) => ({
    id: property.id,
    address_street: property.address_street,
    address_number: property.address_number,
    neighborhood: property.neighborhood,
    city: property.city,
    location: property.location,
    rent_value: property.rent_value,
  }));
}
