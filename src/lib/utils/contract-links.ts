export function buildLinkedContractUrl(
  contractType: "rent" | "sale",
  propertyId: string,
): string {
  const params = new URLSearchParams({
    type: contractType,
    property_id: propertyId,
  });
  return `/contratos/novo/vinculado?${params.toString()}`;
}

export function resolveInitialPropertyId(
  properties: { id: string }[],
  initialPropertyId?: string,
): { propertyId: string; isPreselectionValid: boolean } {
  if (
    initialPropertyId &&
    properties.some((property) => property.id === initialPropertyId)
  ) {
    return { propertyId: initialPropertyId, isPreselectionValid: true };
  }

  return {
    propertyId: properties[0]?.id ?? "",
    isPreselectionValid: !initialPropertyId,
  };
}
