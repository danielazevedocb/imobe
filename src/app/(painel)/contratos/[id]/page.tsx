import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { getContractById } from "@/app/(painel)/contratos/_data-access/get-contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CONTRACT_SOURCE_LABELS,
  CONTRACT_TYPE_LABELS,
} from "@/lib/constants/contract-labels";
import { formatCurrency } from "@/lib/format/currency";

type ContractDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContractDetailPage({
  params,
}: ContractDetailPageProps) {
  const { id } = await params;

  let contract;
  try {
    contract = await getContractById(id);
  } catch {
    notFound();
  }

  const { snapshot } = contract;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {contract.title}
            </h1>
            <Badge>{CONTRACT_TYPE_LABELS[contract.contract_type]}</Badge>
            <Badge variant="secondary">
              {CONTRACT_SOURCE_LABELS[contract.contract_source]}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Gerado em{" "}
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(contract.generated_at))}
          </p>
        </div>
        <Button asChild>
          <a href={`/contratos/${contract.id}/download`}>
            <FileText className="h-4 w-4" />
            Baixar PDF
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imóvel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {snapshot.property.type ? (
            <p>
              <span className="font-medium">Tipo:</span> {snapshot.property.type}
            </p>
          ) : null}
          <p>
            <span className="font-medium">Endereço:</span>{" "}
            {snapshot.property.address_street}
            {snapshot.property.address_number
              ? `, ${snapshot.property.address_number}`
              : ""}
          </p>
          <p>
            <span className="font-medium">Bairro/Cidade:</span>{" "}
            {snapshot.property.neighborhood}, {snapshot.property.city}/
            {snapshot.property.location}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {contract.contract_type === "rent" ? "Locador(a)" : "Vendedor(a)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{snapshot.party_a.name}</p>
            <p>{snapshot.party_a.document}</p>
            <p>{snapshot.party_a.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {contract.contract_type === "rent" ? "Locatário(a)" : "Comprador(a)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{snapshot.party_b.name}</p>
            <p>{snapshot.party_b.document}</p>
            <p>{snapshot.party_b.email}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condições</CardTitle>
          <CardDescription>{snapshot.legal_notice}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {snapshot.rent_details ? (
            <>
              <p>
                Vigência: {snapshot.rent_details.start_date} a{" "}
                {snapshot.rent_details.end_date}
              </p>
              <p>
                Aluguel: {formatCurrency(snapshot.rent_details.rent_amount)}
              </p>
              <p>Vencimento: dia {snapshot.rent_details.due_day}</p>
            </>
          ) : null}
          {snapshot.sale_details ? (
            <>
              <p>
                Preço: {formatCurrency(snapshot.sale_details.sale_price)}
              </p>
              <p>Posse: {snapshot.sale_details.possession_date}</p>
              <p>{snapshot.sale_details.payment_terms}</p>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href="/contratos">Voltar para contratos</Link>
      </Button>
    </div>
  );
}
