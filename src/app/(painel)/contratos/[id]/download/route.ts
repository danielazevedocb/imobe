import { notFound } from "next/navigation";

import { getContractById } from "@/app/(painel)/contratos/_data-access/get-contracts";
import { buildDownloadFileName } from "@/services/contracts/contract-utils";
import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  await requireAuth();
  const { id } = await context.params;

  let contract;
  try {
    contract = await getContractById(id);
  } catch {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("contracts")
    .download(contract.pdf_storage_path);

  if (error || !data) {
    notFound();
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  const fileName = buildDownloadFileName(contract.contract_type, contract.id);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
