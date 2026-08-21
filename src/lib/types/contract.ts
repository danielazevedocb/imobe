export type ContractType = "rent" | "sale";
export type ContractSource = "linked" | "manual";
export type PersonType = "individual" | "company";

export type ContractParty = {
  person_type: PersonType;
  name: string;
  document: string;
  registration?: string | null;
  address: string;
  phone: string;
  email: string;
};

export type ContractPropertySnapshot = {
  type?: string | null;
  address_street: string;
  address_number?: string | null;
  address_complement?: string | null;
  neighborhood: string;
  city: string;
  location: string;
  rent_value?: number | null;
  sale_value?: number | null;
};

export type RentContractDetails = {
  start_date: string;
  end_date: string;
  rent_amount: number;
  due_day: number;
  payment_method: string;
  guarantee_type: string;
  guarantee_value?: number | null;
  adjustment_index: string;
  charges_responsibility: string;
  notes?: string | null;
};

export type SaleContractDetails = {
  sale_price: number;
  payment_terms: string;
  possession_date: string;
  deed_responsibility: string;
  tax_responsibility: string;
  notes?: string | null;
};

export type ContractSnapshot = {
  contract_type: ContractType;
  contract_source: ContractSource;
  property: ContractPropertySnapshot;
  party_a: ContractParty;
  party_b: ContractParty;
  rent_details?: RentContractDetails;
  sale_details?: SaleContractDetails;
  legal_notice: string;
};

export type Contract = {
  id: string;
  user_id: string;
  property_id: string | null;
  contract_type: ContractType;
  contract_source: ContractSource;
  title: string;
  counterparty_name: string;
  snapshot: ContractSnapshot;
  pdf_storage_path: string;
  pdf_size_bytes: number | null;
  idempotency_key: string;
  generated_at: string;
  created_at: string;
  updated_at: string;
};

export type ContractListItem = Pick<
  Contract,
  | "id"
  | "contract_type"
  | "contract_source"
  | "title"
  | "counterparty_name"
  | "property_id"
  | "generated_at"
  | "snapshot"
>;

export const CONTRACT_LEGAL_NOTICE =
  "Modelo operacional gerado pelo Imobe. Recomenda-se revisão jurídica antes da utilização.";
