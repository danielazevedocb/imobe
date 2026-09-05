export type QuickPaymentCompetencyStatus =
  | "free"
  | "pending"
  | "overdue"
  | "received";

export type QuickPaymentCommitStatus =
  | "committed"
  | "already_received"
  | "needs_confirmation"
  | "conflict_changed"
  | "conflict_removed"
  | "property_ineligible"
  | "invalid_amount"
  | "invalid_month"
  | "invalid_operation"
  | "unauthorized";

export type QuickPaymentPropertyOption = {
  id: string;
  address_street: string;
  address_number: string | null;
  neighborhood: string;
  city: string;
  location: string;
  rent_value: number | null;
};

export type QuickPaymentCompetencyResult = {
  status: QuickPaymentCompetencyStatus | "property_ineligible" | "invalid_month" | "unauthorized";
  incomeId?: string;
  amount?: number;
  suggestedAmount?: number;
  updatedAt?: string;
  referenceMonth?: string;
};

export type QuickPaymentCommitResult = {
  status: QuickPaymentCommitStatus;
  incomeId?: string;
  amount?: number;
  incomeStatus?: QuickPaymentCompetencyStatus;
  propertyId?: string;
  referenceMonth?: string;
  updatedAt?: string;
  message?: string;
};
