"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PropertyPhoto } from "@/lib/types/property-photo";
import { MAX_PROPERTY_PHOTOS } from "@/lib/validations/property-photo-schema";

type PropertyPhotoGalleryProps = {
  propertyId: string;
  propertyLabel: string;
  photos: PropertyPhoto[];
  loadError?: boolean;
};

export function PropertyPhotoGallery({
  propertyId,
  propertyLabel,
  photos,
  loadError = false,
}: PropertyPhotoGalleryProps) {
  const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());
  const editHref = `/imoveis/${propertyId}/editar`;
  const canAddMore = photos.length < MAX_PROPERTY_PHOTOS;

  if (loadError) {
    return (
      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Fotos</h2>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar as fotos deste imóvel agora.
        </p>
      </section>
    );
  }

  if (photos.length === 0) {
    return (
      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Fotos</h2>
        <p className="text-sm text-muted-foreground">
          Este imóvel ainda não possui fotos cadastradas.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={editHref}>Adicionar fotos</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Fotos</h2>
          <p className="text-sm text-muted-foreground">
            {photos.length} foto(s) cadastrada(s)
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={editHref}>
            {canAddMore ? "Adicionar fotos" : "Gerenciar fotos"}
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="overflow-hidden rounded-lg border">
            {brokenIds.has(photo.id) ? (
              <div className="flex aspect-[4/3] items-center justify-center bg-muted p-4 text-center text-sm text-muted-foreground">
                Não foi possível exibir esta foto.
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/property-photos/${photo.id}`}
                alt={`${propertyLabel} — foto ${index + 1}`}
                className="aspect-[4/3] h-auto w-full object-cover"
                loading="lazy"
                onError={() =>
                  setBrokenIds((current) => new Set(current).add(photo.id))
                }
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
