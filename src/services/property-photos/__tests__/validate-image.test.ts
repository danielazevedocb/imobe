import sharp from "sharp";

import { validateImageBuffer } from "@/services/property-photos/validate-image";

describe("validateImageBuffer", () => {
  let validPng: Buffer;
  let validJpeg: Buffer;

  beforeAll(async () => {
    validPng = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 10, g: 20, b: 30 },
      },
    })
      .png()
      .toBuffer();

    validJpeg = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg()
      .toBuffer();
  });

  it("accepts valid png and jpeg buffers", async () => {
    const pngResult = await validateImageBuffer(validPng, "foto.png");
    expect(pngResult.valid).toBe(true);
    if (pngResult.valid) {
      expect(pngResult.mimeType).toBe("image/png");
    }

    const jpegResult = await validateImageBuffer(validJpeg, "foto.jpg");
    expect(jpegResult.valid).toBe(true);
    if (jpegResult.valid) {
      expect(jpegResult.mimeType).toBe("image/jpeg");
    }
  });

  it("rejects mismatched extension and corrupted content", async () => {
    const mismatch = await validateImageBuffer(validPng, "foto.jpg");
    expect(mismatch.valid).toBe(false);

    const corrupted = await validateImageBuffer(
      Buffer.from("not-an-image"),
      "foto.png",
    );
    expect(corrupted.valid).toBe(false);
  });

  it("rejects empty files", async () => {
    const result = await validateImageBuffer(Buffer.alloc(0), "foto.png");
    expect(result.valid).toBe(false);
  });
});
