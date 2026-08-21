"use client";

import Link from "next/link";
import { FileText, Pencil } from "lucide-react";

import { DeletePropertyDialog } from "@/app/(painel)/imoveis/_components/delete-property-dialog";
import { GenerateContractButton } from "@/app/(painel)/imoveis/[id]/_components/generate-contract-button";
import { RentalIncomeSection } from "@/app/(painel)/imoveis/[id]/_components/rental-income-section";
import { PropertyContractsSection } from "@/app/(painel)/imoveis/[id]/_components/property-contracts-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants/property-labels";
import { formatCurrency } from "@/lib/format/currency";
import type { RentalIncomePeriod } from "@/lib/format/date";
import type { ContractListItem } from "@/lib/types/contract";
import type { Property } from "@/lib/types/property";
import type { RentalIncome, RentalIncomeSummary } from "@/lib/types/rental-income";

type PropertyDetailProps = {
  property: Property;
  incomes: RentalIncome[];
  incomeSummary: RentalIncomeSummary;
  incomePeriod: RentalIncomePeriod;
  incomeMonthKey?: string;
  contracts: ContractListItem[];
};

export function PropertyDetail({
  property,
  incomes,
  incomeSummary,
  incomePeriod,
  incomeMonthKey,
  contracts,
}: PropertyDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {PROPERTY_TYPE_LABELS[property.type]}
            </h1>
            <Badge>{PROPERTY_PURPOSE_LABELS[property.purpose]}</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            {property.address_street}
            {property.address_number ? `, ${property.address_number}` : ""} —{" "}
            {property.neighborhood}, {property.city}/{property.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GenerateContractButton
            propertyId={property.id}
            purpose={property.purpose}
          />
          <Button variant="outline" asChild className="min-h-11">
            <Link href={`/imoveis/${property.id}/editar`}>
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeletePropertyDialog propertyId={property.id} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Localização completa do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Rua:</span> {property.address_street}
            </p>
            {property.address_number && (
              <p>
                <span className="font-medium">Número:</span>{" "}
                {property.address_number}
              </p>
            )}
            {property.address_complement && (
              <p>
                <span className="font-medium">Complemento:</span>{" "}
                {property.address_complement}
              </p>
            )}
            <p>
              <span className="font-medium">Bairro:</span> {property.neighborhood}
            </p>
            <p>
              <span className="font-medium">Cidade:</span> {property.city}
            </p>
            <p>
              <span className="font-medium">Localização:</span> {property.location}
            </p>
            {property.listing_url && (
              <p>
                <span className="font-medium">Anúncio:</span>{" "}
                <a
                  href={property.listing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver anúncio
                </a>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
            <CardDescription>Informações financeiras do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Valor médio atual:</span>{" "}
              {formatCurrency(property.estimated_value)}
            </p>
            <p>
              <span className="font-medium">IPTU:</span>{" "}
              {formatCurrency(property.iptu_value)}
            </p>
            {(property.purpose === "rent" || property.purpose === "both") && (
              <>
                <Separator className="my-3" />
                <p>
                  <span className="font-medium">Aluguel mensal:</span>{" "}
                  {formatCurrency(property.rent_value)}
                </p>
                <p>
                  <span className="font-medium">Disponível para locação:</span>{" "}
                  {property.rent_available ? "Sim" : "Não"}
                </p>
              </>
            )}
            {(property.purpose === "sale" || property.purpose === "both") && (
              <>
                <Separator className="my-3" />
                <p>
                  <span className="font-medium">Valor de venda:</span>{" "}
                  {formatCurrency(property.sale_value)}
                </p>
                <p>
                  <span className="font-medium">Disponível para venda:</span>{" "}
                  {property.sale_available ? "Sim" : "Não"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <RentalIncomeSection
        property={property}
        incomes={incomes}
        summary={incomeSummary}
        period={incomePeriod}
        monthKey={incomeMonthKey}
      />

      <PropertyContractsSection contracts={contracts} />
    </div>
  );
}
