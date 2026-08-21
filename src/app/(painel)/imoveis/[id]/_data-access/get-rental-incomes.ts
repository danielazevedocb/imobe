import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { RentalIncome } from "@/lib/types/rental-income";

export async function getRentalIncomesByPropertyId(
  propertyId: string,
): Promise<RentalIncome[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rental_incomes")
    .select("*")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .order("reference_month", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar rendimentos");
  }

  return (data ?? []) as RentalIncome[];
}
