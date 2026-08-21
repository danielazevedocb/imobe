"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RentalIncomePeriod } from "@/lib/format/date";
import type { Property } from "@/lib/types/property";
import type { RentalIncome, RentalIncomeSummary } from "@/lib/types/rental-income";

import { RentalIncomeForm } from "./rental-income-form";
import { RentalIncomeTimeline } from "./rental-income-timeline";

type RentalIncomeSectionProps = {
  property: Property;
  incomes: RentalIncome[];
  summary: RentalIncomeSummary;
  period: RentalIncomePeriod;
  monthKey?: string;
};

export function RentalIncomeSection({
  property,
  incomes,
  summary,
  period,
  monthKey,
}: RentalIncomeSectionProps) {
  const canRegister =
    property.purpose === "rent" || property.purpose === "both";
  const hasHistory = incomes.length > 0;

  if (!canRegister && !hasHistory) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimentos</CardTitle>
        <CardDescription>
          {canRegister
            ? "Registre e acompanhe o rendimento mensal deste imóvel."
            : "Histórico de rendimentos registrados antes da mudança de finalidade."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {canRegister ? (
          <RentalIncomeForm propertyId={property.id} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Este imóvel está configurado apenas para venda. Novos rendimentos
            não podem ser registrados, mas o histórico permanece disponível.
          </p>
        )}

        <RentalIncomeTimeline
          incomes={incomes}
          summary={summary}
          period={period}
          monthKey={monthKey}
          propertyId={property.id}
        />
      </CardContent>
    </Card>
  );
}
