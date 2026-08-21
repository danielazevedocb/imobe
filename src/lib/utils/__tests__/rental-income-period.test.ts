import {
  filterIncomesByPeriod,
  summarizeIncomes,
} from "@/lib/utils/rental-income-period";
import type { RentalIncome } from "@/lib/types/rental-income";

const incomes: RentalIncome[] = [
  {
    id: "1",
    user_id: "u1",
    property_id: "p1",
    reference_month: "2026-01-01",
    amount: 1000,
    status: "received",
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    user_id: "u1",
    property_id: "p1",
    reference_month: "2026-02-01",
    amount: 1200,
    status: "pending",
    created_at: "",
    updated_at: "",
  },
];

describe("rental income period utils", () => {
  it("filters incomes by specific month", () => {
    const filtered = filterIncomesByPeriod(incomes, "month", "2026-01");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.amount).toBe(1000);
  });

  it("calculates total received and monthly average for one month", () => {
    const summary = summarizeIncomes(incomes, "month", "2026-01");
    expect(summary.totalReceived).toBe(1000);
    expect(summary.monthlyAverage).toBe(1000);
    expect(summary.monthCount).toBe(1);
  });
});
