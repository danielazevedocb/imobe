import type { RentalIncomeStatus } from "@/lib/types/rental-income";

export const RENTAL_INCOME_STATUS_LABELS: Record<RentalIncomeStatus, string> =
  {
    received: "Recebido",
    pending: "Pendente",
    overdue: "Em atraso",
  };

export const RENTAL_INCOME_STATUS_OPTIONS = (
  Object.entries(RENTAL_INCOME_STATUS_LABELS) as [RentalIncomeStatus, string][]
).map(([value, label]) => ({ value, label }));

export const RENTAL_INCOME_PERIOD_LABELS = {
  month: "Mês específico",
  "6m": "Últimos 6 meses",
  "12m": "Últimos 12 meses",
} as const;
