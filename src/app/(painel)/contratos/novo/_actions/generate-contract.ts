"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { IdActionResult } from "@/lib/types/action-result";
import { parseGenerateContractInput } from "@/lib/validations/contract-schema";
import {
  buildContractSnapshot,
  buildContractTitle,
  buildPdfStoragePath,
  createContractId,
} from "@/services/contracts/contract-utils";
import { generateContractPdfBuffer } from "@/services/contracts/generate-contract-pdf";

export async function generateContractAction(
  input: unknown,
): Promise<IdActionResult> {
  const parsed = parseGenerateContractInput(input);

  if (!parsed.success) {
    return { success: false, errors: parsed.errors };
  }

  const user = await requireAuth();
  const supabase = await createClient();
  const { data, source } = parsed;

  const existing = await supabase
    .from("contracts")
    .select("id")
    .eq("user_id", user.id)
    .eq("idempotency_key", data.idempotency_key)
    .maybeSingle();

  if (existing.data?.id) {
    return { success: true, data: { id: existing.data.id } };
  }

  let propertyId: string | null = null;
  let property = undefined;

  if (source === "linked" && "property_id" in data) {
    propertyId = data.property_id;
    const propertyResult = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .single();

    if (propertyResult.error || !propertyResult.data) {
      return { success: false, message: "Imóvel não encontrado ou incompatível." };
    }

    property = propertyResult.data;
  }

  const snapshot = buildContractSnapshot(data, property);
  const contractId = createContractId();
  const counterpartyName = data.party_b.name;
  const title = buildContractTitle(data.contract_type, counterpartyName);
  const storagePath = buildPdfStoragePath(user.id, contractId);

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateContractPdfBuffer(snapshot);
  } catch {
    return {
      success: false,
      message: "Não foi possível gerar o PDF do contrato.",
    };
  }

  const uploadResult = await supabase.storage
    .from("contracts")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadResult.error) {
    return {
      success: false,
      message: "Não foi possível salvar o PDF do contrato.",
    };
  }

  const insertResult = await supabase.from("contracts").insert({
    id: contractId,
    user_id: user.id,
    property_id: propertyId,
    contract_type: data.contract_type,
    contract_source: source,
    title,
    counterparty_name: counterpartyName,
    snapshot,
    pdf_storage_path: storagePath,
    pdf_size_bytes: pdfBuffer.byteLength,
    idempotency_key: data.idempotency_key,
    updated_at: new Date().toISOString(),
  });

  if (insertResult.error) {
    await supabase.storage.from("contracts").remove([storagePath]);
    if (insertResult.error.code === "23505") {
      const retry = await supabase
        .from("contracts")
        .select("id")
        .eq("user_id", user.id)
        .eq("idempotency_key", data.idempotency_key)
        .maybeSingle();
      if (retry.data?.id) {
        return { success: true, data: { id: retry.data.id } };
      }
    }
    return {
      success: false,
      message: "Não foi possível salvar o contrato.",
    };
  }

  revalidatePath("/contratos");
  if (propertyId) {
    revalidatePath(`/imoveis/${propertyId}`);
  }

  return { success: true, data: { id: contractId } };
}
