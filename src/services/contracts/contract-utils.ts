import "server-only";

import { randomUUID } from "crypto";

import type { Property } from "@/lib/types/property";
import {
  CONTRACT_LEGAL_NOTICE,
  type ContractPropertySnapshot,
  type ContractSnapshot,
  type ContractType,
} from "@/lib/types/contract";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants/property-labels";
import type { ParsedGenerateContractInput } from "@/lib/validations/contract-schema";
import type { z } from "zod";
import { manualPropertySchema } from "@/lib/validations/contract-schema";

type ManualProperty = z.infer<typeof manualPropertySchema>;

function propertyToSnapshot(property: Property): ContractPropertySnapshot {
  return {
    type: PROPERTY_TYPE_LABELS[property.type],
    address_street: property.address_street,
    address_number: property.address_number,
    address_complement: property.address_complement,
    neighborhood: property.neighborhood,
    city: property.city,
    location: property.location,
    rent_value: property.rent_value,
    sale_value: property.sale_value,
  };
}

function manualPropertyToSnapshot(
  property: ManualProperty,
): ContractPropertySnapshot {
  return {
    type: property.type ? PROPERTY_TYPE_LABELS[property.type] : null,
    address_street: property.address_street,
    address_number: property.address_number ?? null,
    address_complement: property.address_complement ?? null,
    neighborhood: property.neighborhood,
    city: property.city,
    location: property.location,
  };
}

export function buildContractSnapshot(
  input: ParsedGenerateContractInput,
  property?: Property,
): ContractSnapshot {
  const contractType = input.contract_type;
  const contractSource = "property_id" in input ? "linked" : "manual";

  let propertySnapshot: ContractPropertySnapshot;

  if (contractSource === "linked" && property) {
    propertySnapshot = propertyToSnapshot(property);
  } else if ("property" in input) {
    propertySnapshot = manualPropertyToSnapshot(input.property);
  } else {
    throw new Error("Dados do imóvel inválidos para o contrato.");
  }

  const snapshot: ContractSnapshot = {
    contract_type: contractType,
    contract_source: contractSource,
    property: propertySnapshot,
    party_a: input.party_a,
    party_b: input.party_b,
    legal_notice: CONTRACT_LEGAL_NOTICE,
  };

  if (contractType === "rent" && "rent_details" in input) {
    snapshot.rent_details = input.rent_details;
  }

  if (contractType === "sale" && "sale_details" in input) {
    snapshot.sale_details = input.sale_details;
  }

  return snapshot;
}

export function buildContractTitle(
  contractType: ContractType,
  counterpartyName: string,
): string {
  const prefix = contractType === "rent" ? "Contrato de locação" : "Contrato de venda";
  return `${prefix} — ${counterpartyName}`;
}

export function createContractId(): string {
  return randomUUID();
}

export function buildPdfStoragePath(userId: string, contractId: string): string {
  return `${userId}/${contractId}.pdf`;
}

export function buildDownloadFileName(
  contractType: ContractType,
  contractId: string,
): string {
  const prefix = contractType === "rent" ? "contrato-locacao" : "contrato-venda";
  return `${prefix}-${contractId.slice(0, 8)}.pdf`;
}
