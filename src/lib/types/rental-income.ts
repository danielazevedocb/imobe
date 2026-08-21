export type RentalIncomeStatus = "received" | "pending" | "overdue";

export type RentalIncome = {
  id: string;
  user_id: string;
  property_id: string;
  reference_month: string;
  amount: number;
  status: RentalIncomeStatus;
  created_at: string;
  updated_at: string;
};

export type RentalIncomeSummary = {
  totalReceived: number;
  monthlyAverage: number;
  monthCount: number;
};
