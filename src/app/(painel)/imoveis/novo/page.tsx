import type { Metadata } from "next";

import { PropertyForm } from "@/app/(painel)/imoveis/_components/property-form";

export const metadata: Metadata = {
  title: "Cadastrar imóvel",
};

export default function NovoImovelPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar imóvel</h1>
        <p className="text-muted-foreground">
          Preencha os dados do imóvel para adicioná-lo à sua carteira.
        </p>
      </div>
      <PropertyForm mode="create" />
    </div>
  );
}
