export type PropertyPurpose = "rent" | "sale" | "both";

export type PropertyType =
  | "apartment"
  | "house"
  | "commercial"
  | "land"
  | "other";

export type Property = {
  id: string;
  user_id: string;
  type: PropertyType;
  address_street: string;
  address_number: string | null;
  address_complement: string | null;
  neighborhood: string;
  city: string;
  location: string;
  listing_url: string | null;
  estimated_value: number | null;
  iptu_value: number | null;
  purpose: PropertyPurpose;
  rent_value: number | null;
  sale_value: number | null;
  rent_available: boolean;
  sale_available: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};
