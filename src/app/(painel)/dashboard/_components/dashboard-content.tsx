import Link from "next/link";
import { Building2, FileText, TrendingUp, Wallet } from "lucide-react";

import type { DashboardSummary } from "@/app/(painel)/dashboard/_data-access/get-dashboard-summary";
import type { QuickPaymentPropertyOption } from "@/lib/types/quick-payment";
import { QuickPaymentDialog } from "@/app/(painel)/dashboard/_components/quick-payment-dialog";
import { EmptyState } from "@/app/(painel)/imoveis/_components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";

type DashboardContentProps = {
  summary: DashboardSummary;
  quickPaymentProperties: QuickPaymentPropertyOption[];
};

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Building2;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function DashboardContent({
  summary,
  quickPaymentProperties,
}: DashboardContentProps) {
  const isEmpty = summary.totalProperties === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua carteira de imóveis.
          </p>
        </div>
        <QuickPaymentDialog properties={quickPaymentProperties} />
      </div>

      {isEmpty ? (
        <EmptyState
          title="Sua carteira ainda está vazia"
          description="Cadastre seu primeiro imóvel para ver patrimônio, disponibilidade e rendimentos aqui."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Imóveis"
              value={String(summary.totalProperties)}
              description="Total cadastrado"
              icon={Building2}
            />
            <MetricCard
              title="Patrimônio"
              value={formatCurrency(summary.estimatedPatrimony)}
              description="Valor estimado"
              icon={TrendingUp}
            />
            <MetricCard
              title="Recebido no mês"
              value={formatCurrency(summary.currentMonthReceived)}
              description="Rendimentos recebidos"
              icon={Wallet}
            />
            <MetricCard
              title="Contratos"
              value={String(summary.totalContracts)}
              description="Gerados"
              icon={FileText}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade</CardTitle>
                <CardDescription>
                  Imóveis disponíveis e indisponíveis por canal aplicável.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                  <p className="text-2xl font-bold">
                    {summary.availableProperties}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Indisponíveis</p>
                  <p className="text-2xl font-bold">
                    {summary.unavailableProperties}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Para aluguel</p>
                  <p className="text-2xl font-bold">{summary.rentProperties}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Para venda</p>
                  <p className="text-2xl font-bold">{summary.saleProperties}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimentos</CardTitle>
                <CardDescription>
                  Resumo básico dos aluguéis registrados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recebido nos últimos 12 meses
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.last12MonthsReceived)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pendente ou em atraso
                  </p>
                  <p className="text-2xl font-bold">
                    {summary.pendingOrOverdueCount}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/imoveis">Ver imóveis</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contratos">Ver contratos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
