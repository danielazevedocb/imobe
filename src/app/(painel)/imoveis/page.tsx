import Link from "next/link";
import { Plus } from "lucide-react";

import { PropertyList } from "@/app/(painel)/imoveis/_components/property-list";
import { getProperties } from "@/app/(painel)/imoveis/_data-access/get-properties";
import { Button } from "@/components/ui/button";

export default async function ImoveisPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-muted-foreground">
            Gerencie sua carteira de imóveis para aluguel e venda.
          </p>
        </div>
        <Button asChild>
          <Link href="/imoveis/novo">
            <Plus className="h-4 w-4" />
            Cadastrar imóvel
          </Link>
        </Button>
      </div>

      <PropertyList properties={properties} />
    </div>
  );
}
