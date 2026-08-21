const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Normaliza YYYY-MM para o primeiro dia do mês em UTC. */
export function normalizeReferenceMonth(month: string): string {
  const [year, monthPart] = month.split("-");
  return `${year}-${monthPart}-01`;
}

/** Formata uma data ISO (YYYY-MM-DD) como mês/ano em pt-BR. */
export function formatReferenceMonth(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  const formatted = MONTH_FORMATTER.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Retorna YYYY-MM do mês atual em UTC. */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export type RentalIncomePeriod = "month" | "6m" | "12m";

export type PeriodRange = {
  start: string;
  end: string;
  monthCount: number;
};

/** Calcula intervalo de competência para filtros de rendimento. */
export function getPeriodRange(
  period: RentalIncomePeriod,
  monthKey?: string,
): PeriodRange {
  const now = new Date();
  const endYear = now.getUTCFullYear();
  const endMonth = now.getUTCMonth();

  if (period === "month" && monthKey) {
    const normalized = normalizeReferenceMonth(monthKey);
    return {
      start: normalized,
      end: normalized,
      monthCount: 1,
    };
  }

  const monthCount = period === "6m" ? 6 : 12;
  const startDate = new Date(Date.UTC(endYear, endMonth - (monthCount - 1), 1));
  const startYear = startDate.getUTCFullYear();
  const startMonthNum = startDate.getUTCMonth() + 1;
  const endMonthNum = endMonth + 1;

  return {
    start: `${startYear}-${String(startMonthNum).padStart(2, "0")}-01`,
    end: `${endYear}-${String(endMonthNum).padStart(2, "0")}-01`,
    monthCount,
  };
}
