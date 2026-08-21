import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types/property";
import type { Contract, ContractListItem } from "@/lib/types/contract";

export async function getContracts(): Promise<ContractListItem[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select(
      "id, contract_type, contract_source, title, counterparty_name, property_id, generated_at, snapshot",
    )
    .eq("user_id", user.id)
    .order("generated_at", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar contratos");
  }

  return (data ?? []) as ContractListItem[];
}

export async function getContractById(id: string): Promise<Contract> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Contrato não encontrado");
  }

  return data as Contract;
}

export async function getContractsByPropertyId(
  propertyId: string,
): Promise<ContractListItem[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contracts")
    .select(
      "id, contract_type, contract_source, title, counterparty_name, property_id, generated_at, snapshot",
    )
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .order("generated_at", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar contratos do imóvel");
  }

  return (data ?? []) as ContractListItem[];
}

export async function getCompatibleProperties(
  contractType: "rent" | "sale",
): Promise<Property[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (contractType === "rent") {
    query = query.in("purpose", ["rent", "both"]);
  } else {
    query = query.in("purpose", ["sale", "both"]);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar imóveis compatíveis");
  }

  return (data ?? []) as Property[];
}
