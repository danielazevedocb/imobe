import type { Metadata } from "next";

import { PropertyForm } from "@/app/(painel)/imoveis/_components/property-form";
import { getPropertyById } from "@/app/(painel)/imoveis/_data-access/get-property-by-id";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditPropertyPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getPropertyById(id);
    return {
      title: `Editar — ${property.address_street}`,
    };
  } catch {
    return { title: "Editar imóvel" };
  }
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar imóvel</h1>
        <p className="text-muted-foreground">
          Atualize as informações do imóvel selecionado.
        </p>
      </div>
      <PropertyForm mode="edit" property={property} />
    </div>
  );
}
