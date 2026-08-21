"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RENTAL_INCOME_PERIOD_LABELS } from "@/lib/constants/rental-income-labels";
import { RENTAL_INCOME_STATUS_LABELS } from "@/lib/constants/rental-income-labels";
import { formatCurrency } from "@/lib/format/currency";
import { formatReferenceMonth } from "@/lib/format/date";
import type { RentalIncomePeriod } from "@/lib/format/date";
import type { RentalIncome, RentalIncomeSummary } from "@/lib/types/rental-income";

import { DeleteRentalIncomeDialog } from "./delete-rental-income-dialog";

type RentalIncomeTimelineProps = {
  incomes: RentalIncome[];
  summary: RentalIncomeSummary;
  period: RentalIncomePeriod;
  monthKey?: string;
  propertyId: string;
};

function statusVariant(status: RentalIncome["status"]) {
  if (status === "received") return "success" as const;
  if (status === "overdue") return "warning" as const;
  return "secondary" as const;
}

export function RentalIncomeTimeline({
  incomes,
  summary,
  period,
  monthKey,
  propertyId,
}: RentalIncomeTimelineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParams(nextPeriod: RentalIncomePeriod, nextMonth?: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", nextPeriod);
      if (nextPeriod === "month" && nextMonth) {
        params.set("month", nextMonth);
      } else {
        params.delete("month");
      }
      router.replace(`?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium">Período</p>
            <Select
              value={period}
              onValueChange={(value) =>
                updateParams(value as RentalIncomePeriod, monthKey)
              }
              disabled={isPending}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(RENTAL_INCOME_PERIOD_LABELS) as [
                    RentalIncomePeriod,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {period === "month" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Mês</p>
              <Input
                type="month"
                className="w-full sm:w-[180px]"
                value={monthKey ?? ""}
                onChange={(event) =>
                  updateParams("month", event.target.value || undefined)
                }
                disabled={isPending}
              />
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Total recebido</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.totalReceived)}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Média mensal</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.monthlyAverage)}
            </p>
          </div>
        </div>
      </div>

      {incomes.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum rendimento encontrado para o período selecionado.
        </div>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {formatReferenceMonth(income.reference_month)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(Number(income.amount))}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge variant={statusVariant(income.status)}>
                  {RENTAL_INCOME_STATUS_LABELS[income.status]}
                </Badge>
                <DeleteRentalIncomeDialog
                  income={income}
                  propertyId={propertyId}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
