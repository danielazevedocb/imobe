import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonthKey, normalizeReferenceMonth } from "@/lib/format/date";
import type { Property } from "@/lib/types/property";
import type { RentalIncome } from "@/lib/types/rental-income";

export type DashboardSummary = {
  totalProperties: number;
  rentProperties: number;
  saleProperties: number;
  availableProperties: number;
  unavailableProperties: number;
  estimatedPatrimony: number;
  currentMonthReceived: number;
  last12MonthsReceived: number;
  pendingOrOverdueCount: number;
  totalContracts: number;
};

function isPropertyAvailable(property: Property): boolean {
  const rentApplicable =
    property.purpose === "rent" || property.purpose === "both";
  const saleApplicable =
    property.purpose === "sale" || property.purpose === "both";

  const rentAvailable = rentApplicable ? property.rent_available : false;
  const saleAvailable = saleApplicable ? property.sale_available : false;

  return rentAvailable || saleAvailable;
}

function summarizeProperties(properties: Property[]) {
  return properties.reduce(
    (acc, property) => {
      acc.total += 1;
      if (property.purpose === "rent" || property.purpose === "both") {
        acc.rent += 1;
      }
      if (property.purpose === "sale" || property.purpose === "both") {
        acc.sale += 1;
      }
      if (isPropertyAvailable(property)) {
        acc.available += 1;
      } else {
        acc.unavailable += 1;
      }
      if (property.estimated_value) {
        acc.patrimony += Number(property.estimated_value);
      }
      return acc;
    },
    {
      total: 0,
      rent: 0,
      sale: 0,
      available: 0,
      unavailable: 0,
      patrimony: 0,
    },
  );
}

function summarizeIncomes(incomes: RentalIncome[]) {
  const currentMonth = normalizeReferenceMonth(getCurrentMonthKey());
  const now = new Date();
  const startDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1),
  );
  const startKey = `${startDate.getUTCFullYear()}-${String(startDate.getUTCMonth() + 1).padStart(2, "0")}-01`;

  let currentMonthReceived = 0;
  let last12MonthsReceived = 0;
  let pendingOrOverdueCount = 0;

  for (const income of incomes) {
    const ref = income.reference_month.slice(0, 10);
    const amount = Number(income.amount);

    if (income.status === "received") {
      if (ref === currentMonth) currentMonthReceived += amount;
      if (ref >= startKey) last12MonthsReceived += amount;
    }

    if (income.status === "pending" || income.status === "overdue") {
      pendingOrOverdueCount += 1;
    }
  }

  return {
    currentMonthReceived,
    last12MonthsReceived,
    pendingOrOverdueCount,
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const user = await requireAuth();
  const supabase = await createClient();

  const [propertiesResult, incomesResult, contractsResult] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null),
    supabase.from("rental_incomes").select("*").eq("user_id", user.id),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (propertiesResult.error) {
    throw new Error("Erro ao buscar imóveis do dashboard");
  }

  const properties = (propertiesResult.data ?? []) as Property[];
  const propertySummary = summarizeProperties(properties);
  const incomes = (incomesResult.data ?? []) as RentalIncome[];
  const incomeSummary = summarizeIncomes(incomes);

  return {
    totalProperties: propertySummary.total,
    rentProperties: propertySummary.rent,
    saleProperties: propertySummary.sale,
    availableProperties: propertySummary.available,
    unavailableProperties: propertySummary.unavailable,
    estimatedPatrimony: propertySummary.patrimony,
    currentMonthReceived: incomeSummary.currentMonthReceived,
    last12MonthsReceived: incomeSummary.last12MonthsReceived,
    pendingOrOverdueCount: incomeSummary.pendingOrOverdueCount,
    totalContracts: contractsResult.count ?? 0,
  };
}
