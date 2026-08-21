import type { Metadata } from "next";

import { PropertyDetail } from "@/app/(painel)/imoveis/_components/property-detail";
import { getPropertyById } from "@/app/(painel)/imoveis/_data-access/get-property-by-id";
import { getContractsByPropertyId } from "@/app/(painel)/contratos/_data-access/get-contracts";
import { getRentalIncomesByPropertyId } from "@/app/(painel)/imoveis/[id]/_data-access/get-rental-incomes";
import { getCurrentMonthKey, type RentalIncomePeriod } from "@/lib/format/date";
import {
  filterIncomesByPeriod,
  summarizeIncomes,
} from "@/lib/utils/rental-income-period";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string; month?: string }>;
};

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getPropertyById(id);
    return {
      title: `${property.address_street} — Detalhes`,
    };
  } catch {
    return { title: "Imóvel" };
  }
}

function parsePeriod(value?: string): RentalIncomePeriod {
  if (value === "6m" || value === "12m" || value === "month") return value;
  return "12m";
}

export default async function PropertyPage({
  params,
  searchParams,
}: PropertyPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const period = parsePeriod(query.period);
  const monthKey = query.month ?? getCurrentMonthKey();

  const [property, allIncomes, contracts] = await Promise.all([
    getPropertyById(id),
    getRentalIncomesByPropertyId(id),
    getContractsByPropertyId(id),
  ]);

  const filteredIncomes = filterIncomesByPeriod(allIncomes, period, monthKey);
  const summary = summarizeIncomes(allIncomes, period, monthKey);

  return (
    <PropertyDetail
      property={property}
      incomes={filteredIncomes}
      incomeSummary={summary}
      incomePeriod={period}
      incomeMonthKey={monthKey}
      contracts={contracts}
    />
  );
}
