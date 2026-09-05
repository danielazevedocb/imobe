export const PROPERTY_PHOTOS_BUCKET = "property-photos";

export function buildPropertyPhotoStagingPath(
  userId: string,
  operationId: string,
  photoId: string,
  extension: string,
): string {
  return `${userId}/staging/${operationId}/${photoId}.${extension}`;
}

export function buildPropertyPhotoConfirmedPath(
  userId: string,
  propertyId: string,
  photoId: string,
  extension: string,
): string {
  return `${userId}/properties/${propertyId}/${photoId}.${extension}`;
}

export function toConfirmedStoragePath(
  stagingPath: string,
  propertyId: string,
): string {
  return stagingPath.replace("/staging/", `/properties/${propertyId}/`);
}
