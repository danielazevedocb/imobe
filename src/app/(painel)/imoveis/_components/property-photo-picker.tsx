"use client";

import { ImagePlus, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type {
  ExistingPropertyPhotoState,
  SelectedPropertyPhotoFile,
} from "@/lib/types/property-photo";
import {
  MAX_PROPERTY_PHOTOS,
  validateSelectedPhotoFile,
} from "@/lib/validations/property-photo-schema";

type PropertyPhotoPickerProps = {
  mode: "create" | "edit";
  initialExisting?: ExistingPropertyPhotoState[];
  disabled?: boolean;
  onStateChange?: (state: PropertyPhotoPickerSnapshot) => void;
};

export type PropertyPhotoPickerSnapshot = {
  keptExisting: ExistingPropertyPhotoState[];
  newFiles: SelectedPropertyPhotoFile[];
  totalCount: number;
  canAddMore: boolean;
  errors: string[];
};

function createClientId() {
  return crypto.randomUUID();
}

export function PropertyPhotoPicker({
  mode,
  initialExisting = [],
  disabled = false,
  onStateChange,
}: PropertyPhotoPickerProps) {
  const [existing, setExisting] = useState(initialExisting);
  const [newFiles, setNewFiles] = useState<SelectedPropertyPhotoFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const keptExisting = useMemo(
    () =>
      [...existing]
        .filter((photo) => !photo.markedForRemoval)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [existing],
  );

  const totalCount = keptExisting.length + newFiles.length;
  const canAddMore = totalCount < MAX_PROPERTY_PHOTOS;

  const snapshot = useMemo<PropertyPhotoPickerSnapshot>(
    () => ({
      keptExisting,
      newFiles,
      totalCount,
      canAddMore,
      errors,
    }),
    [errors, keptExisting, newFiles, totalCount, canAddMore],
  );

  useEffect(() => {
    onStateChange?.(snapshot);
  }, [onStateChange, snapshot]);

  const revokePreview = useCallback((previewUrl: string) => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  }, []);

  useEffect(() => {
    return () => {
      newFiles.forEach((file) => revokePreview(file.previewUrl));
    };
  }, [newFiles, revokePreview]);

  function handleSelectFiles(selected: FileList | null) {
    if (!selected?.length || disabled) {
      return;
    }

    const incoming = Array.from(selected);
    const nextErrors: string[] = [];
    const accepted: SelectedPropertyPhotoFile[] = [];

    for (const file of incoming) {
      const validationError = validateSelectedPhotoFile(file);
      if (validationError) {
        nextErrors.push(`${file.name}: ${validationError}`);
        continue;
      }

      accepted.push({
        clientId: createClientId(),
        file,
        previewUrl: URL.createObjectURL(file),
        originalName: file.name,
        sizeBytes: file.size,
        mimeType: file.type as "image/png" | "image/jpeg",
      });
    }

    const availableSlots = MAX_PROPERTY_PHOTOS - totalCount;
    if (accepted.length > availableSlots) {
      accepted.splice(availableSlots).forEach((file) => revokePreview(file.previewUrl));
      nextErrors.push(
        `Selecione no máximo ${availableSlots} foto(s) para completar o limite de ${MAX_PROPERTY_PHOTOS}.`,
      );
      setErrors(nextErrors);
      return;
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    setNewFiles((current) => [...current, ...accepted]);
  }

  function handleRemoveNew(clientId: string) {
    setNewFiles((current) => {
      const target = current.find((file) => file.clientId === clientId);
      if (target) {
        revokePreview(target.previewUrl);
      }
      return current.filter((file) => file.clientId !== clientId);
    });
  }

  function handleToggleExistingRemoval(photoId: string) {
    setExisting((current) =>
      current.map((photo) =>
        photo.id === photoId
          ? { ...photo, markedForRemoval: !photo.markedForRemoval }
          : photo,
      ),
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Fotos do imóvel</h2>
        <p className="text-sm text-muted-foreground">
          Adicione até {MAX_PROPERTY_PHOTOS} fotos em PNG ou JPEG, com até 3 MB
          cada.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          disabled={disabled || !canAddMore}
          onChange={(event) => {
            handleSelectFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !canAddMore}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          Adicionar fotos
        </Button>
        <p className="text-sm text-muted-foreground">
          {totalCount}/{MAX_PROPERTY_PHOTOS} selecionada(s)
        </p>
      </div>

      {errors.length > 0 ? (
        <div className="space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      {mode === "edit" && existing.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Fotos atuais</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {existing.map((photo) => (
              <div
                key={photo.id}
                className={`relative overflow-hidden rounded-lg border ${
                  photo.markedForRemoval ? "opacity-50" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.previewUrl}
                  alt={photo.originalName}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/50 p-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    disabled={disabled}
                    onClick={() => handleToggleExistingRemoval(photo.id)}
                  >
                    {photo.markedForRemoval ? (
                      <RotateCcw className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {newFiles.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {mode === "edit" ? "Novas fotos" : "Fotos selecionadas"}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {newFiles.map((photo) => (
              <div key={photo.clientId} className="relative overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.previewUrl}
                  alt={photo.originalName}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 space-y-1 bg-black/50 p-2 text-xs text-white">
                  <p className="truncate">{photo.originalName}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => handleRemoveNew(photo.clientId)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export async function uploadSelectedPropertyPhotos(input: {
  operationId: string;
  files: SelectedPropertyPhotoFile[];
}) {
  const stagingIds: string[] = [];

  for (const file of input.files) {
    const formData = new FormData();
    formData.append("operation_id", input.operationId);
    formData.append("file", file.file);

    const response = await fetch("/api/property-photos/upload", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as {
      success: boolean;
      message?: string;
      stagingId?: string;
    };

    if (!response.ok || !payload.success || !payload.stagingId) {
      throw new Error(payload.message ?? "Falha ao enviar uma das fotos.");
    }

    stagingIds.push(payload.stagingId);
  }

  return stagingIds;
}
