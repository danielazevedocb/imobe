"use client";

import Link from "next/link";
import { ArrowLeft, Building2, FilePenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ContractOnboarding() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="w-fit px-0">
        <Link href="/contratos">
          <ArrowLeft className="h-4 w-4" />
          Voltar para contratos
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerar contrato</h1>
        <p className="text-muted-foreground">
          Escolha o tipo de contrato e como deseja preencher os dados.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contrato de locação</CardTitle>
            <CardDescription>
              Gere um contrato operacional de aluguel com dados das partes e do
              imóvel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/contratos/novo/vinculado?type=rent">
                <Building2 className="h-4 w-4" />
                Usar imóvel cadastrado
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/contratos/novo/manual?type=rent">
                <FilePenLine className="h-4 w-4" />
                Preencher manualmente
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contrato de venda</CardTitle>
            <CardDescription>
              Gere um contrato operacional de compra e venda com revisão
              jurídica recomendada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/contratos/novo/vinculado?type=sale">
                <Building2 className="h-4 w-4" />
                Usar imóvel cadastrado
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/contratos/novo/manual?type=sale">
                <FilePenLine className="h-4 w-4" />
                Preencher manualmente
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
