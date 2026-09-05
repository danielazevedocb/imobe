export type PropertyPhoto = {
  id: string;
  property_id: string;
  storage_path: string;
  original_name: string;
  mime_type: "image/png" | "image/jpeg";
  size_bytes: number;
  sort_order: number;
  checksum: string;
};

export type PropertyPhotoManifestItem =
  | {
      kind: "keep";
      photo_id: string;
      sort_order: number;
    }
  | {
      kind: "new";
      staging_id: string;
    };

export type PropertyPhotoOperationStatus =
  | "prepared"
  | "committed"
  | "failed"
  | "operation_not_found"
  | "conflict_version"
  | "photo_limit_exceeded"
  | "invalid_operation"
  | "unauthorized";

export type SelectedPropertyPhotoFile = {
  clientId: string;
  file: File;
  previewUrl: string;
  originalName: string;
  sizeBytes: number;
  mimeType: "image/png" | "image/jpeg";
  rejectionReason?: string;
};

export type ExistingPropertyPhotoState = {
  id: string;
  previewUrl: string;
  originalName: string;
  sortOrder: number;
  markedForRemoval: boolean;
};
