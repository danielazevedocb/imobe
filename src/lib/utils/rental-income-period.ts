import type { RentalIncome, RentalIncomeSummary } from "@/lib/types/rental-income";
import type { RentalIncomePeriod } from "@/lib/format/date";
import { getPeriodRange } from "@/lib/format/date";

export function filterIncomesByPeriod(
  incomes: RentalIncome[],
  period: RentalIncomePeriod,
  monthKey?: string,
): RentalIncome[] {
  const range = getPeriodRange(period, monthKey);
  return incomes.filter((income) => {
    const ref = income.reference_month.slice(0, 10);
    return ref >= range.start && ref <= range.end;
  });
}

export function summarizeIncomes(
  incomes: RentalIncome[],
  period: RentalIncomePeriod,
  monthKey?: string,
): RentalIncomeSummary {
  const filtered = filterIncomesByPeriod(incomes, period, monthKey);
  const range = getPeriodRange(period, monthKey);
  const totalReceived = filtered
    .filter((income) => income.status === "received")
    .reduce((sum, income) => sum + Number(income.amount), 0);

  return {
    totalReceived,
    monthlyAverage: totalReceived / range.monthCount,
    monthCount: range.monthCount,
  };
}
