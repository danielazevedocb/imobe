"use client";

import Link from "next/link";
import { ChevronDown, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildLinkedContractUrl } from "@/lib/utils/contract-links";
import type { PropertyPurpose } from "@/lib/types/property";

type GenerateContractButtonProps = {
  propertyId: string;
  purpose: PropertyPurpose;
};

export function GenerateContractButton({
  propertyId,
  purpose,
}: GenerateContractButtonProps) {
  if (purpose === "both") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-h-11 gap-2"
            aria-label="Gerar contrato para este imóvel"
          >
            <FileText className="h-4 w-4" />
            Gerar contrato
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={buildLinkedContractUrl("rent", propertyId)}>
              Contrato de locação
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={buildLinkedContractUrl("sale", propertyId)}>
              Contrato de venda
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const contractType = purpose === "rent" ? "rent" : "sale";

  return (
    <Button variant="outline" asChild className="min-h-11">
      <Link
        href={buildLinkedContractUrl(contractType, propertyId)}
        aria-label={`Gerar contrato de ${contractType === "rent" ? "locação" : "venda"} para este imóvel`}
      >
        <FileText className="h-4 w-4" />
        Gerar contrato
      </Link>
    </Button>
  );
}
