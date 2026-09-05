import { profileSchema } from "@/lib/validations/profile-schema";

describe("profileSchema", () => {
  it("accepts valid profile data", () => {
    const result = profileSchema.safeParse({
      full_name: "  Maria Silva  ",
      phone: "(11) 98765-4321",
      instagram_username: "@maria.imoveis",
      tiktok_username: "maria.imoveis",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.full_name).toBe("Maria Silva");
      expect(result.data.instagram_username).toBe("maria.imoveis");
      expect(result.data.tiktok_username).toBe("maria.imoveis");
    }
  });

  it("normalizes optional fields to empty strings", () => {
    const result = profileSchema.safeParse({
      full_name: "João",
      phone: "",
      instagram_username: "",
      tiktok_username: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("");
      expect(result.data.instagram_username).toBe("");
    }
  });

  it("rejects invalid phone and social links", () => {
    expect(
      profileSchema.safeParse({
        full_name: "João",
        phone: "123",
      }).success,
    ).toBe(false);

    expect(
      profileSchema.safeParse({
        full_name: "João",
        instagram_username: "https://instagram.com/user",
      }).success,
    ).toBe(false);
  });
});
