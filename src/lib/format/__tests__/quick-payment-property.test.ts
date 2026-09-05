import { formatQuickPaymentPropertyLabel } from "@/lib/format/quick-payment-property";

describe("formatQuickPaymentPropertyLabel", () => {
  it("formats address with neighborhood and city", () => {
    expect(
      formatQuickPaymentPropertyLabel({
        id: "1",
        address_street: "Rua A",
        address_number: "100",
        neighborhood: "Centro",
        city: "São Paulo",
        location: "SP",
        rent_value: 2500,
      }),
    ).toBe("Rua A, 100 — Centro, São Paulo/SP");
  });
});
