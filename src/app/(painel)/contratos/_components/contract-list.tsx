"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { EmptyState } from "@/app/(painel)/imoveis/_components/empty-state";
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
import type { ContractListItem } from "@/lib/types/contract";

type ContractListProps = {
  contracts: ContractListItem[];
};

export function ContractList({ contracts }: ContractListProps) {
  if (contracts.length === 0) {
    return (
      <EmptyState
        title="Nenhum contrato gerado"
        description="Gere contratos de locação ou venda em PDF e acompanhe o histórico aqui."
        action={
          <Button asChild>
            <Link href="/contratos/novo">
              <Plus className="h-4 w-4" />
              Gerar contrato
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4">
      {contracts.map((contract) => (
        <Card key={contract.id}>
          <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{contract.title}</CardTitle>
                <Badge>{CONTRACT_TYPE_LABELS[contract.contract_type]}</Badge>
                <Badge variant="secondary">
                  {CONTRACT_SOURCE_LABELS[contract.contract_source]}
                </Badge>
              </div>
              <CardDescription>
                Contraparte: {contract.counterparty_name}
              </CardDescription>
              <CardDescription>
                Gerado em{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(contract.generated_at))}
              </CardDescription>
              {contract.property_id ? (
                <CardDescription>
                  Vinculado ao imóvel cadastrado
                </CardDescription>
              ) : (
                <CardDescription>Preenchido manualmente</CardDescription>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild className="min-h-11">
                <Link href={`/contratos/${contract.id}`}>Detalhes</Link>
              </Button>
              <Button asChild className="min-h-11">
                <a href={`/contratos/${contract.id}/download`}>
                  <FileText className="h-4 w-4" />
                  PDF
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {contract.snapshot.property.address_street},{" "}
              {contract.snapshot.property.neighborhood} —{" "}
              {contract.snapshot.property.city}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
