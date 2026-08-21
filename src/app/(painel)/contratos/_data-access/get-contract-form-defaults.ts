import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types/property";
import {
  buildTenantAddressDefaults,
  type PartyDefaults,
} from "@/lib/utils/contract-party-defaults";

export type ContractFormDefaults = {
  partyBDefaults: PartyDefaults;
};

export async function getContractFormDefaults(
  propertyId?: string,
): Promise<ContractFormDefaults> {
  const user = await requireAuth();
  let property: Property | null = null;

  if (propertyId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    property = (data as Property | null) ?? null;
  }

  return {
    partyBDefaults: buildTenantAddressDefaults(property),
  };
}
