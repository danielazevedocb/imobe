import Link from "next/link";
import { FileText } from "lucide-react";

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

type PropertyContractsSectionProps = {
  contracts: ContractListItem[];
};

export function PropertyContractsSection({
  contracts,
}: PropertyContractsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contratos</CardTitle>
        <CardDescription>
          Contratos vinculados a este imóvel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contracts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum contrato vinculado a este imóvel.
          </p>
        ) : (
          contracts.map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{contract.title}</p>
                  <Badge>{CONTRACT_TYPE_LABELS[contract.contract_type]}</Badge>
                  <Badge variant="secondary">
                    {CONTRACT_SOURCE_LABELS[contract.contract_source]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contraparte: {contract.counterparty_name}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/contratos/${contract.id}`}>Detalhes</Link>
                </Button>
                <Button size="sm" asChild>
                  <a href={`/contratos/${contract.id}/download`}>
                    <FileText className="h-4 w-4" />
                    PDF
                  </a>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
