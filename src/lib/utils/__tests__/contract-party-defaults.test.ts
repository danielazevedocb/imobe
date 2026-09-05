import type { Property } from "@/lib/types/property";
import {
  buildEmptyPartyDefaults,
  buildTenantAddressDefaults,
  formatPropertyAddress,
  getPropertyFinancialDefault,
} from "@/lib/utils/contract-party-defaults";

const sampleProperty: Property = {
  id: "prop-1",
  user_id: "user-1",
  type: "apartment",
  address_street: "Rua das Flores",
  address_number: "123",
  address_complement: "Apto 45",
  neighborhood: "Centro",
  city: "São Paulo",
  location: "SP",
  listing_url: null,
  estimated_value: null,
  iptu_value: null,
  purpose: "rent",
  rent_value: 2500,
  sale_value: null,
  rent_available: true,
  sale_available: false,
  deleted_at: null,
  photo_collection_version: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("contract-party-defaults", () => {
  it("formats property address for party defaults", () => {
    expect(formatPropertyAddress(sampleProperty)).toBe(
      "Rua das Flores, 123, Apto 45 — Centro — São Paulo/SP",
    );
  });

  it("builds empty party defaults", () => {
    expect(buildEmptyPartyDefaults()).toEqual({
      person_type: "individual",
      name: "",
      document: "",
      registration: "",
      address: "",
      phone: "",
      email: "",
    });
  });

  it("builds tenant address defaults from property", () => {
    expect(buildTenantAddressDefaults(sampleProperty)).toEqual({
      person_type: "individual",
      name: "",
      document: "",
      registration: "",
      address: "Rua das Flores, 123, Apto 45 — Centro — São Paulo/SP",
      phone: "",
      email: "",
    });
  });

  it("returns empty address when property is missing", () => {
    expect(buildTenantAddressDefaults(null).address).toBe("");
  });

  it("returns rent or sale financial defaults from property", () => {
    expect(getPropertyFinancialDefault(sampleProperty, "rent")).toBe(2500);
    expect(getPropertyFinancialDefault(sampleProperty, "sale")).toBe("");
  });
});
