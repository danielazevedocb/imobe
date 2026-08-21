import Link from "next/link";
import { notFound } from "next/navigation";

import { ManualContractForm } from "@/app/(painel)/contratos/novo/_components/manual-contract-form";
import { Button } from "@/components/ui/button";

type ManualContractPageProps = {
  searchParams: Promise<{ type?: string }>;
};

function parseContractType(value?: string): "rent" | "sale" | null {
  if (value === "rent" || value === "sale") return value;
  return null;
}

export default async function ManualContractPage({
  searchParams,
}: ManualContractPageProps) {
  const query = await searchParams;
  const contractType = parseContractType(query.type);

  if (!contractType) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="w-fit px-0">
        <Link href="/contratos/novo">Voltar</Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contrato com preenchimento manual
        </h1>
        <p className="text-muted-foreground">
          Informe os dados do imóvel e das partes sem precisar cadastrar o imóvel
          antes.
        </p>
      </div>

      <ManualContractForm contractType={contractType} />
    </div>
  );
}
