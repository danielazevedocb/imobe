import Link from "next/link";
import { Plus } from "lucide-react";

import { ContractList } from "@/app/(painel)/contratos/_components/contract-list";
import { getContracts } from "@/app/(painel)/contratos/_data-access/get-contracts";
import { Button } from "@/components/ui/button";

export default async function ContratosPage() {
  const contracts = await getContracts();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gere e gerencie contratos de locação e venda.
          </p>
        </div>
        <Button asChild>
          <Link href="/contratos/novo">
            <Plus className="h-4 w-4" />
            Gerar contrato
          </Link>
        </Button>
      </div>

      <ContractList contracts={contracts} />
    </div>
  );
}
