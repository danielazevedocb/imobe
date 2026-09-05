import { quickPaymentAmountSchema } from "@/lib/validations/quick-payment-schema";

describe("quickPaymentAmountSchema", () => {
  it("accepts decimal strings with comma or dot", () => {
    expect(quickPaymentAmountSchema.parse("2500,50")).toBe(2500.5);
    expect(quickPaymentAmountSchema.parse("2500.50")).toBe(2500.5);
    expect(quickPaymentAmountSchema.parse(1500)).toBe(1500);
  });

  it("rejects zero, negative and over-limit values", () => {
    expect(quickPaymentAmountSchema.safeParse("0").success).toBe(false);
    expect(quickPaymentAmountSchema.safeParse("0,00").success).toBe(false);
    expect(quickPaymentAmountSchema.safeParse("-10").success).toBe(false);
    expect(
      quickPaymentAmountSchema.safeParse("1000000000000").success,
    ).toBe(false);
  });

  it("rejects more than two decimal places", () => {
    expect(quickPaymentAmountSchema.safeParse("10,123").success).toBe(false);
  });
});
