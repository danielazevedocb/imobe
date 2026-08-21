import {
  buildLinkedContractUrl,
  resolveInitialPropertyId,
} from "@/lib/utils/contract-links";

describe("contract links", () => {
  it("builds linked contract url with query params", () => {
    expect(buildLinkedContractUrl("rent", "11111111-1111-1111-1111-111111111111")).toBe(
      "/contratos/novo/vinculado?type=rent&property_id=11111111-1111-1111-1111-111111111111",
    );
  });

  it("prefers initial property when compatible", () => {
    const properties = [{ id: "a" }, { id: "b" }];
    const result = resolveInitialPropertyId(properties, "b");
    expect(result.propertyId).toBe("b");
    expect(result.isPreselectionValid).toBe(true);
  });

  it("falls back when initial property is incompatible", () => {
    const properties = [{ id: "a" }];
    const result = resolveInitialPropertyId(properties, "missing");
    expect(result.propertyId).toBe("a");
    expect(result.isPreselectionValid).toBe(false);
  });
});
