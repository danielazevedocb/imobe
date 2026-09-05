import { buildKeptPhotoManifest } from "@/lib/utils/property-photo-manifest";

describe("buildKeptPhotoManifest", () => {
  it("preserves kept photo order for update operations", () => {
    const manifest = buildKeptPhotoManifest([
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        previewUrl: "/api/property-photos/photo-1",
        originalName: "a.jpg",
        sortOrder: 2,
        markedForRemoval: false,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        previewUrl: "/api/property-photos/photo-2",
        originalName: "b.jpg",
        sortOrder: 0,
        markedForRemoval: false,
      },
    ]);

    expect(manifest).toEqual([
      {
        kind: "keep",
        photo_id: "550e8400-e29b-41d4-a716-446655440000",
        sort_order: 0,
      },
      {
        kind: "keep",
        photo_id: "550e8400-e29b-41d4-a716-446655440001",
        sort_order: 1,
      },
    ]);
  });
});
