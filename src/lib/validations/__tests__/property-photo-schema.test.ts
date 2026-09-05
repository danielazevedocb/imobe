import {
  isAllowedPhotoExtension,
  MAX_PROPERTY_PHOTOS,
  validateSelectedPhotoFile,
} from "@/lib/validations/property-photo-schema";

describe("property photo validation helpers", () => {
  it("accepts png and jpeg extensions", () => {
    expect(isAllowedPhotoExtension("foto.PNG")).toBe(true);
    expect(isAllowedPhotoExtension("foto.jpg")).toBe(true);
    expect(isAllowedPhotoExtension("foto.gif")).toBe(false);
  });

  it("validates selected files by size and mime", () => {
    const valid = new File([new Uint8Array([1, 2, 3])], "foto.jpg", {
      type: "image/jpeg",
    });
    expect(validateSelectedPhotoFile(valid)).toBeNull();

    const empty = new File([], "foto.jpg", { type: "image/jpeg" });
    expect(validateSelectedPhotoFile(empty)).toBe("Arquivo vazio");

    const tooLarge = new File([new Uint8Array(3_000_001)], "foto.jpg", {
      type: "image/jpeg",
    });
    expect(validateSelectedPhotoFile(tooLarge)).toBe("Arquivo acima de 3 MB");
  });

  it("exposes the PRD photo limit", () => {
    expect(MAX_PROPERTY_PHOTOS).toBe(10);
  });
});
