import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { getCompatibleProperties } from "@/app/(painel)/contratos/_data-access/get-contracts";
import { getContractFormDefaults } from "@/app/(painel)/contratos/_data-access/get-contract-form-defaults";
import { LinkedContractForm } from "@/app/(painel)/contratos/novo/_components/linked-contract-form";
import { Button } from "@/components/ui/button";

type LinkedContractPageProps = {
  searchParams: Promise<{ type?: string; property_id?: string }>;
};

const entryParamsSchema = z.object({
  type: z.enum(["rent", "sale"]),
  property_id: z.string().uuid().optional(),
});

function parseEntryParams(query: { type?: string; property_id?: string }) {
  const parsed = entryParamsSchema.safeParse({
    type: query.type,
    property_id: query.property_id,
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export default async function LinkedContractPage({
  searchParams,
}: LinkedContractPageProps) {
  const query = await searchParams;
  const entryParams = parseEntryParams(query);

  if (!entryParams) {
    notFound();
  }

  const { type: contractType, property_id: initialPropertyId } = entryParams;
  const [properties, { partyBDefaults }] = await Promise.all([
    getCompatibleProperties(contractType),
    getContractFormDefaults(initialPropertyId),
  ]);

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="w-fit px-0">
        <Link href="/contratos/novo">Voltar</Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contrato vinculado a imóvel
        </h1>
        <p className="text-muted-foreground">
          Use um imóvel cadastrado como base para gerar o contrato de{" "}
          {contractType === "rent" ? "locação" : "venda"}.
        </p>
      </div>

      <LinkedContractForm
        contractType={contractType}
        properties={properties}
        initialPropertyId={initialPropertyId}
        partyBDefaults={partyBDefaults}
      />
    </div>
  );
}
